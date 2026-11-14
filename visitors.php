<?php
/**
 * ZYNTSHOP — visitors.php
 * Log viewer: kung anong device / browser / OS ang nagbubukas ng website mo.
 * Naka-password (tingnan ang config.php).
 */
declare(strict_types=1);

require __DIR__ . '/config.php';

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'httponly' => true,
    'samesite' => 'Strict',
    'secure'   => !empty($_SERVER['HTTPS']),
]);
session_start();
date_default_timezone_set(LOG_TIMEZONE);

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self'; base-uri 'none'");

function e($v): string
{
    return htmlspecialchars((string) $v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function self_url(array $q = []): string
{
    $base = strtok($_SERVER['REQUEST_URI'] ?? 'visitors.php', '?');
    return $base . ($q ? '?' . http_build_query($q) : '');
}

const DEFAULT_PASSWORD = 'CHANGE_THIS_PASSWORD';
$configured = ADMIN_PASSWORD !== DEFAULT_PASSWORD && strlen(ADMIN_PASSWORD) >= 8;

if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(16));
}

$error = '';

// ---------- POST actions ----------
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $action = (string) ($_POST['action'] ?? '');

    if ($action === 'login') {
        if (!$configured) {
            $error = 'Palitan muna ang ADMIN_PASSWORD sa config.php (at least 8 characters).';
        } elseif (hash_equals(ADMIN_PASSWORD, (string) ($_POST['password'] ?? ''))) {
            session_regenerate_id(true);
            $_SESSION['ok'] = true;
            header('Location: ' . self_url());
            exit;
        } else {
            usleep(900000); // pabagalin ang hulaan ng password
            $error = 'Mali ang password.';
        }
    } elseif (!empty($_SESSION['ok']) && hash_equals($_SESSION['csrf'], (string) ($_POST['csrf'] ?? ''))) {
        if ($action === 'logout') {
            $_SESSION = [];
            session_destroy();
            header('Location: ' . self_url());
            exit;
        }
        if ($action === 'clear') {
            foreach (['visits.jsonl', 'visits.old.jsonl'] as $f) {
                $p = LOG_DIR . '/' . $f;
                if (is_file($p)) {
                    @unlink($p);
                }
            }
            header('Location: ' . self_url());
            exit;
        }
    }
}

// ---------- LOGIN SCREEN ----------
if (empty($_SESSION['ok'])) {
    ?><!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ZyntShop · Visitor Log</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#0d0e12;color:#f0f0f5;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .box{width:100%;max-width:360px;background:#151821;border:1px solid #262a36;border-radius:16px;padding:28px}
  h1{font-size:22px;font-weight:800;margin-bottom:4px}h1 span{color:#e62e3d}
  p{color:#8b92a5;font-size:13px;margin-bottom:18px}
  input{width:100%;padding:12px;border-radius:10px;border:1px solid #2c3140;background:#0d0e12;color:#fff;font-size:14px;margin-bottom:12px}
  input:focus{outline:2px solid #e62e3d;border-color:transparent}
  button{width:100%;padding:12px;border:0;border-radius:10px;background:#e62e3d;color:#fff;font-weight:800;letter-spacing:.5px;cursor:pointer}
  .err{background:rgba(230,46,61,.12);border:1px solid rgba(230,46,61,.4);color:#ff8a94;padding:10px;border-radius:8px;font-size:13px;margin-bottom:12px}
</style></head><body>
<form class="box" method="post" action="<?= e(self_url()) ?>">
  <h1>ZYNT<span>SHOP</span></h1>
  <p>Visitor Log · Admin only</p>
  <?php if ($error): ?><div class="err"><?= e($error) ?></div><?php endif; ?>
  <?php if (!$configured && !$error): ?><div class="err">Hindi pa napapalitan ang password sa <b>config.php</b>.</div><?php endif; ?>
  <input type="hidden" name="action" value="login">
  <input type="password" name="password" placeholder="Password" autocomplete="current-password" autofocus required>
  <button type="submit">LOGIN</button>
</form></body></html>
<?php
    exit;
}

// ---------- LOAD LOG ----------
function load_rows(): array
{
    $rows = [];
    foreach ([LOG_DIR . '/visits.old.jsonl', LOG_DIR . '/visits.jsonl'] as $f) {
        if (!is_file($f)) {
            continue;
        }
        $fh = @fopen($f, 'r');
        if (!$fh) {
            continue;
        }
        while (($line = fgets($fh)) !== false) {
            $r = json_decode($line, true);
            if (is_array($r) && isset($r['ts'])) {
                $rows[] = $r;
            }
        }
        fclose($fh);
    }
    return $rows;
}

$all = load_rows();

$range  = in_array($_GET['range'] ?? '', ['today', '7d', '30d', 'all'], true) ? $_GET['range'] : '7d';
$devSel = in_array($_GET['dev'] ?? '', ['Mobile', 'Tablet', 'Desktop', 'Bot'], true) ? $_GET['dev'] : '';
$evSel  = in_array($_GET['ev'] ?? '', ['visit', 'view', 'order'], true) ? $_GET['ev'] : '';

$now   = time();
$since = match ($range) {
    'today' => strtotime('today'),
    '7d'    => $now - 7 * 86400,
    '30d'   => $now - 30 * 86400,
    default => 0,
};

$inRange = array_values(array_filter($all, function ($r) use ($since, $devSel) {
    return (int) $r['ts'] >= $since && ($devSel === '' || ($r['dev'] ?? '') === $devSel);
}));

// ---------- CSV EXPORT ----------
if (($_GET['export'] ?? '') === 'csv') {
    $rowsOut = array_filter($inRange, fn($r) => $evSel === '' || ($r['t'] ?? '') === $evSel);
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="zyntshop-visitors-' . date('Ymd-His') . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['Time', 'Event', 'Device', 'Model', 'OS', 'Browser', 'Screen', 'Viewport', 'IP', 'Language', 'Timezone', 'Section', 'Referrer', 'Details']);
    $safe = static function ($v): string {
        $v = (string) $v;
        return ($v !== '' && strpos('=+-@', $v[0]) !== false) ? "'" . $v : $v;
    };
    foreach (array_reverse(array_values($rowsOut)) as $r) {
        $details = '';
        if (!empty($r['ex']['items'])) {
            $parts = [];
            foreach ($r['ex']['items'] as $it) {
                $parts[] = ($it['n'] ?? '') . ' x' . ($it['q'] ?? 1);
            }
            $details = implode('; ', $parts) . ' | total ' . ($r['ex']['total'] ?? 0) . ' | ' . ($r['ex']['pay'] ?? '');
        }
        fputcsv($out, array_map($safe, [
            date('Y-m-d H:i:s', (int) $r['ts']), $r['t'] ?? '', $r['dev'] ?? '', $r['model'] ?? '', $r['os'] ?? '',
            $r['br'] ?? '', $r['scr'] ?? '', $r['vp'] ?? '', $r['ip'] ?? '', $r['lang'] ?? '', $r['tz'] ?? '',
            $r['pg'] ?? '', $r['ref'] ?? '', $details,
        ]));
    }
    fclose($out);
    exit;
}

// ---------- STATS ----------
$visits  = array_values(array_filter($inRange, fn($r) => ($r['t'] ?? '') === 'visit'));
$orders  = array_values(array_filter($inRange, fn($r) => ($r['t'] ?? '') === 'order'));
$views   = array_values(array_filter($inRange, fn($r) => ($r['t'] ?? '') === 'view'));

$unique = [];
foreach ($inRange as $r) {
    $unique[md5(($r['ip'] ?? '') . '|' . ($r['ua'] ?? ''))] = true;
}

$online = [];
foreach ($all as $r) {
    if ((int) $r['ts'] >= $now - 300 && ($r['dev'] ?? '') !== 'Bot') {
        $online[($r['sid'] ?? '') !== '' ? $r['sid'] : md5(($r['ip'] ?? '') . ($r['ua'] ?? ''))] = true;
    }
}

function tally(array $rows, string $key, int $limit = 6): array
{
    $c = [];
    foreach ($rows as $r) {
        $v = trim((string) ($r[$key] ?? ''));
        if ($v === '') {
            $v = '(none)';
        }
        $c[$v] = ($c[$v] ?? 0) + 1;
    }
    arsort($c);
    return array_slice($c, 0, $limit, true);
}

$mobileCount = count(array_filter($visits, fn($r) => ($r['dev'] ?? '') === 'Mobile'));
$mobilePct   = $visits ? round($mobileCount / count($visits) * 100) : 0;

$breakdowns = [
    'Device type'  => tally($visits, 'dev'),
    'Operating system' => tally($visits, 'os'),
    'Browser'      => tally($visits, 'br'),
    'Phone / model' => tally(array_filter($visits, fn($r) => ($r['model'] ?? '') !== ''), 'model'),
    'Top sections' => tally($views, 'pg'),
    'Came from'    => tally($visits, 'ref'),
];

// ---------- TABLE ROWS ----------
$tableRows = array_values(array_filter($inRange, fn($r) => $evSel === '' || ($r['t'] ?? '') === $evSel));
$tableRows = array_slice(array_reverse($tableRows), 0, 300);

$devIcon = ['Mobile' => '📱', 'Tablet' => '📲', 'Desktop' => '💻', 'Bot' => '🤖'];

function ago(int $ts): string
{
    $d = time() - $ts;
    if ($d < 60) return $d . 's ago';
    if ($d < 3600) return floor($d / 60) . 'm ago';
    if ($d < 86400) return floor($d / 3600) . 'h ago';
    return floor($d / 86400) . 'd ago';
}

$csrf = $_SESSION['csrf'];
?><!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ZyntShop · Visitor Log</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#0d0e12;color:#f0f0f5;padding:20px;max-width:1280px;margin:0 auto}
  header{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:18px}
  h1{font-size:22px;font-weight:800}h1 span{color:#e62e3d}
  h1 small{display:block;font-size:12px;color:#8b92a5;font-weight:500;margin-top:2px}
  .actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
  .btn{background:#1b1e26;border:1px solid #2e3342;color:#d0d3dc;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block}
  .btn:hover{border-color:#e62e3d;color:#fff}
  .btn.danger{color:#ff8a94}
  form.inline{display:inline}
  label.chk{font-size:12px;color:#9ca3af;display:flex;align-items:center;gap:6px;cursor:pointer}
  .filters{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px}
  select{background:#151821;color:#f0f0f5;border:1px solid #2c3140;border-radius:8px;padding:8px 10px;font-size:13px}
  .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:18px}
  .stat{background:#151821;border:1px solid #262a36;border-radius:12px;padding:14px}
  .stat b{display:block;font-size:26px;font-weight:800}
  .stat span{font-size:11px;color:#8b92a5;letter-spacing:1px;text-transform:uppercase}
  .stat.live b{color:#34d399}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-bottom:22px}
  .panel{background:#151821;border:1px solid #262a36;border-radius:12px;padding:14px}
  .panel h3{font-size:12px;color:#e62e3d;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px}
  .bar{margin-bottom:8px;font-size:13px}
  .bar .row{display:flex;justify-content:space-between;gap:8px}
  .bar .row span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .bar .track{height:5px;border-radius:99px;background:#232733;margin-top:4px;overflow:hidden}
  .bar .fill{height:100%;background:#e62e3d}
  .empty{color:#6b7280;font-size:13px}
  .tablewrap{overflow-x:auto;background:#151821;border:1px solid #262a36;border-radius:12px}
  table{border-collapse:collapse;width:100%;font-size:13px;min-width:900px}
  th{position:sticky;top:0;background:#1b1e26;text-align:left;padding:10px 12px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8b92a5;white-space:nowrap}
  td{padding:9px 12px;border-top:1px solid #222632;vertical-align:top}
  tr:hover td{background:#181b24}
  .pill{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;background:#232733;color:#d0d3dc}
  .pill.visit{background:rgba(52,211,153,.14);color:#34d399}
  .pill.view{background:rgba(96,165,250,.14);color:#60a5fa}
  .pill.order{background:rgba(230,46,61,.18);color:#ff8a94}
  .muted{color:#8b92a5;font-size:12px}
  .details{max-width:340px;word-break:break-word}
  @media (max-width:600px){body{padding:12px}}
</style></head><body>

<header>
  <h1>ZYNT<span>SHOP</span> · Visitor Log
    <small>Oras: <?= e(LOG_TIMEZONE) ?> · Kabuuang na-log: <?= count($all) ?> events</small></h1>
  <div class="actions">
    <label class="chk"><input type="checkbox" id="autoRefresh"> Auto-refresh (30s)</label>
    <a class="btn" href="<?= e(self_url($_GET)) ?>">⟳ Refresh</a>
    <a class="btn" href="<?= e(self_url(array_merge($_GET, ['export' => 'csv']))) ?>">⬇ Export CSV</a>
    <form class="inline" method="post" action="<?= e(self_url()) ?>" onsubmit="return confirm('Burahin ang LAHAT ng log? Hindi na ito mababawi.')">
      <input type="hidden" name="action" value="clear"><input type="hidden" name="csrf" value="<?= e($csrf) ?>">
      <button class="btn danger" type="submit">🗑 Clear log</button>
    </form>
    <form class="inline" method="post" action="<?= e(self_url()) ?>">
      <input type="hidden" name="action" value="logout"><input type="hidden" name="csrf" value="<?= e($csrf) ?>">
      <button class="btn" type="submit">Logout</button>
    </form>
  </div>
</header>

<form class="filters" method="get" action="<?= e(self_url()) ?>">
  <select name="range" onchange="this.form.submit()">
    <?php foreach (['today' => 'Today', '7d' => 'Last 7 days', '30d' => 'Last 30 days', 'all' => 'All time'] as $k => $lbl): ?>
      <option value="<?= e($k) ?>" <?= $range === $k ? 'selected' : '' ?>><?= e($lbl) ?></option>
    <?php endforeach; ?>
  </select>
  <select name="dev" onchange="this.form.submit()">
    <option value="">All devices</option>
    <?php foreach (['Mobile', 'Tablet', 'Desktop', 'Bot'] as $d): ?>
      <option value="<?= e($d) ?>" <?= $devSel === $d ? 'selected' : '' ?>><?= e($d) ?></option>
    <?php endforeach; ?>
  </select>
  <select name="ev" onchange="this.form.submit()">
    <option value="">All events</option>
    <option value="visit" <?= $evSel === 'visit' ? 'selected' : '' ?>>Visits (website opened)</option>
    <option value="view" <?= $evSel === 'view' ? 'selected' : '' ?>>Section views</option>
    <option value="order" <?= $evSel === 'order' ? 'selected' : '' ?>>Orders started</option>
  </select>
</form>

<section class="stats">
  <div class="stat live"><b><?= count($online) ?></b><span>Online now (5 min)</span></div>
  <div class="stat"><b><?= count($visits) ?></b><span>Visits</span></div>
  <div class="stat"><b><?= count($unique) ?></b><span>Unique devices</span></div>
  <div class="stat"><b><?= $mobilePct ?>%</b><span>On mobile</span></div>
  <div class="stat"><b><?= count($orders) ?></b><span>Orders started</span></div>
</section>

<section class="grid">
  <?php foreach ($breakdowns as $title => $data): ?>
    <div class="panel">
      <h3><?= e($title) ?></h3>
      <?php if (!$data): ?>
        <div class="empty">Wala pang data.</div>
      <?php else:
        $max = max($data);
        foreach ($data as $label => $count): ?>
        <div class="bar">
          <div class="row"><span><?= e($label) ?></span><span><?= (int) $count ?></span></div>
          <div class="track"><div class="fill" style="width:<?= max(4, (int) round($count / $max * 100)) ?>%"></div></div>
        </div>
      <?php endforeach; endif; ?>
    </div>
  <?php endforeach; ?>
</section>

<div class="tablewrap">
<table>
  <thead><tr>
    <th>Time</th><th>Event</th><th>Device</th><th>OS</th><th>Browser</th><th>Screen</th><th>IP</th><th>Lang / TZ</th><th>Details</th>
  </tr></thead>
  <tbody>
  <?php if (!$tableRows): ?>
    <tr><td colspan="9" class="empty" style="padding:24px;text-align:center">Wala pang log para sa filter na ito. Buksan ang website mo para magkaroon ng unang entry.</td></tr>
  <?php endif; ?>
  <?php foreach ($tableRows as $r):
    $t = (string) ($r['t'] ?? '');
    $details = '';
    if ($t === 'view') {
        $details = 'Opened: ' . ($r['pg'] ?? '');
    } elseif ($t === 'visit') {
        $details = ($r['ref'] ?? '') !== '' ? 'From: ' . $r['ref'] : 'Direct';
    } elseif ($t === 'order' && !empty($r['ex'])) {
        $parts = [];
        foreach (($r['ex']['items'] ?? []) as $it) {
            $parts[] = ($it['n'] ?? '') . ' x' . (int) ($it['q'] ?? 1);
        }
        $details = implode(', ', $parts) . ' — ₱' . number_format((float) ($r['ex']['total'] ?? 0)) . ' (' . ($r['ex']['pay'] ?? '') . ') #' . ($r['ex']['code'] ?? '');
    }
  ?>
    <tr>
      <td><?= e(date('M j, g:i:s A', (int) $r['ts'])) ?><div class="muted"><?= e(ago((int) $r['ts'])) ?></div></td>
      <td><span class="pill <?= e($t) ?>"><?= e($t) ?></span></td>
      <td><?= e($devIcon[$r['dev'] ?? ''] ?? '❔') ?> <?= e($r['dev'] ?? '') ?><?php if (!empty($r['model'])): ?><div class="muted"><?= e($r['model']) ?></div><?php endif; ?></td>
      <td><?= e($r['os'] ?? '') ?></td>
      <td><?= e($r['br'] ?? '') ?></td>
      <td><?= e($r['scr'] ?? '') ?><div class="muted"><?= e($r['vp'] ?? '') ?></div></td>
      <td><?= e($r['ip'] ?? '') ?></td>
      <td><?= e($r['lang'] ?? '') ?><div class="muted"><?= e($r['tz'] ?? '') ?></div></td>
      <td class="details"><?= e($details) ?></td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</div>
<p class="muted" style="margin:12px 0 30px">Ipinapakita ang pinakabagong 300 events. Ang browser na ito ay hindi na ibibilang sa log kapag nag-open ka ng website (naka-save sa browser mo).</p>

<script>
  // Huwag bilangin ang sarili mong pagbisita sa website
  try { localStorage.setItem('zyntNoTrack', '1'); } catch (e) {}
  (function () {
    var box = document.getElementById('autoRefresh'), t;
    try { box.checked = localStorage.getItem('zyntAutoRefresh') === '1'; } catch (e) {}
    function arm() { clearTimeout(t); if (box.checked) t = setTimeout(function () { location.reload(); }, 30000); }
    box.addEventListener('change', function () {
      try { localStorage.setItem('zyntAutoRefresh', box.checked ? '1' : '0'); } catch (e) {}
      arm();
    });
    arm();
  })();
</script>
</body></html>
