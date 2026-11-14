<?php
/**
 * ZYNTSHOP — track.php
 * Tinatanggap ng endpoint na ito ang maliit na ping mula sa website (script.js)
 * at isinusulat sa logs/visits.jsonl (isang JSON line kada event).
 */
declare(strict_types=1);

require __DIR__ . '/config.php';

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    exit;
}

$raw  = (string) file_get_contents('php://input', false, null, 0, 6000);
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    exit;
}

function clean($v, int $max = 80): string
{
    $v = is_scalar($v) ? (string) $v : '';
    $v = preg_replace('/[\x00-\x1F\x7F]/u', '', $v) ?? '';
    return function_exists('mb_substr') ? mb_substr($v, 0, $max, 'UTF-8') : substr($v, 0, $max);
}

function client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    if (TRUST_PROXY_IP) {
        $cands = [$_SERVER['HTTP_CF_CONNECTING_IP'] ?? '', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''];
        foreach ($cands as $c) {
            $first = trim(explode(',', (string) $c)[0]);
            if ($first !== '' && filter_var($first, FILTER_VALIDATE_IP)) {
                $ip = $first;
                break;
            }
        }
    }
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'unknown';
}

function parse_ua(string $ua, bool $touch): array
{
    $os = 'Unknown';
    $device = 'Desktop';
    $model = '';
    $browser = 'Unknown';

    if ($ua === '') {
        return ['device' => 'Unknown', 'os' => $os, 'browser' => $browser, 'model' => $model];
    }

    // ---- OS + device type
    if (preg_match('/Android\s([\d.]+)/i', $ua, $m)) {
        $os = 'Android ' . strtok($m[1], '.');
        $device = stripos($ua, 'Mobile') !== false ? 'Mobile' : 'Tablet';
        if (preg_match('/Android[^;]*;\s*([^;)]+?)(?:\sBuild|\)|;)/i', $ua, $mm)) {
            $mod = trim($mm[1]);
            if ($mod !== '' && strcasecmp($mod, 'K') !== 0 && strcasecmp($mod, 'wv') !== 0) {
                $model = $mod;
            }
        }
    } elseif (preg_match('/iPhone|iPod/i', $ua)) {
        $os = 'iOS' . (preg_match('/OS (\d+)[_.]/', $ua, $m) ? ' ' . $m[1] : '');
        $device = 'Mobile';
        $model = 'iPhone';
    } elseif (preg_match('/iPad/i', $ua)) {
        $os = 'iPadOS' . (preg_match('/OS (\d+)[_.]/', $ua, $m) ? ' ' . $m[1] : '');
        $device = 'Tablet';
        $model = 'iPad';
    } elseif (preg_match('/Windows NT ([\d.]+)/i', $ua, $m)) {
        $map = ['10.0' => 'Windows 10/11', '6.3' => 'Windows 8.1', '6.2' => 'Windows 8', '6.1' => 'Windows 7'];
        $os = $map[$m[1]] ?? ('Windows NT ' . $m[1]);
    } elseif (stripos($ua, 'Macintosh') !== false || stripos($ua, 'Mac OS X') !== false) {
        if ($touch) { // iPad na naka "desktop site"
            $os = 'iPadOS';
            $device = 'Tablet';
            $model = 'iPad';
        } else {
            $os = 'macOS';
        }
    } elseif (stripos($ua, 'CrOS') !== false) {
        $os = 'ChromeOS';
    } elseif (stripos($ua, 'Linux') !== false) {
        $os = 'Linux';
    }

    // ---- Browser (in-app browsers muna, kasi common sa FB shop)
    if (preg_match('/FBAN\/Messenger|FB_IAB\/MESSENGER|Orca-Android/i', $ua)) {
        $browser = 'Messenger App';
    } elseif (preg_match('/FBAN|FBAV|FB_IAB/i', $ua)) {
        $browser = 'Facebook App';
    } elseif (stripos($ua, 'Instagram') !== false) {
        $browser = 'Instagram App';
    } elseif (stripos($ua, 'TikTok') !== false || stripos($ua, 'musical_ly') !== false) {
        $browser = 'TikTok App';
    } elseif (preg_match('/Edg(?:e|A|iOS)?\//i', $ua)) {
        $browser = 'Edge';
    } elseif (preg_match('/OPR\/|Opera/i', $ua)) {
        $browser = 'Opera';
    } elseif (stripos($ua, 'SamsungBrowser') !== false) {
        $browser = 'Samsung Internet';
    } elseif (stripos($ua, 'UCBrowser') !== false) {
        $browser = 'UC Browser';
    } elseif (preg_match('/Firefox\/|FxiOS/i', $ua)) {
        $browser = 'Firefox';
    } elseif (preg_match('/Chrome\/|CriOS/i', $ua)) {
        $browser = 'Chrome';
    } elseif (stripos($ua, 'Safari') !== false) {
        $browser = 'Safari';
    }

    // ---- Bots
    if (preg_match('/bot|crawl|spider|slurp|facebookexternalhit|headless|lighthouse|preview|monitor/i', $ua)) {
        $device = 'Bot';
    }

    return ['device' => $device, 'os' => $os, 'browser' => $browser, 'model' => $model];
}

// ---- allowed event types
$type = clean($data['type'] ?? '', 12);
if (!in_array($type, ['visit', 'view', 'order'], true)) {
    http_response_code(400);
    exit;
}

$touch = !empty($data['touch']);
$ua    = clean($_SERVER['HTTP_USER_AGENT'] ?? '', 400);
$info  = parse_ua($ua, $touch);

$row = [
    'ts'    => time(),
    't'     => $type,
    'sid'   => clean($data['sid'] ?? '', 40),
    'ip'    => client_ip(),
    'dev'   => $info['device'],
    'os'    => $info['os'],
    'br'    => $info['browser'],
    'model' => clean($info['model'], 40),
    'scr'   => clean($data['screen'] ?? '', 14),
    'vp'    => clean($data['vp'] ?? '', 14),
    'lang'  => clean($data['lang'] ?? '', 12),
    'tz'    => clean($data['tz'] ?? '', 40),
    'ref'   => clean($data['ref'] ?? '', 80),
    'pg'    => clean($data['page'] ?? '', 30),
    'th'    => clean($data['theme'] ?? '', 6),
    'ua'    => clean($ua, 200),
    'ex'    => null,
];

if ($type === 'order' && isset($data['extra']) && is_array($data['extra'])) {
    $ex    = $data['extra'];
    $items = [];
    foreach (array_slice(is_array($ex['items'] ?? null) ? $ex['items'] : [], 0, 25) as $it) {
        if (!is_array($it)) {
            continue;
        }
        $items[] = [
            'n' => clean($it['n'] ?? '', 60),
            'q' => (int) ($it['q'] ?? 1),
            'b' => clean($it['b'] ?? '', 20),
        ];
    }
    $row['ex'] = [
        'items' => $items,
        'total' => (float) ($ex['total'] ?? 0),
        'pay'   => clean($ex['pay'] ?? '', 20),
        'code'  => clean($ex['code'] ?? '', 24),
    ];
}

// ---- make sure log dir exists & is protected
if (!is_dir(LOG_DIR)) {
    @mkdir(LOG_DIR, 0750, true);
}
if (is_dir(LOG_DIR)) {
    $ht = LOG_DIR . '/.htaccess';
    if (!is_file($ht)) {
        @file_put_contents($ht, "# Bawal i-access mula sa browser\n<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n");
    }
    if (!is_file(LOG_DIR . '/index.html')) {
        @file_put_contents(LOG_DIR . '/index.html', '');
    }

    $file = LOG_DIR . '/visits.jsonl';
    clearstatcache(true, $file);
    if (is_file($file) && filesize($file) > MAX_LOG_BYTES) {
        @rename($file, LOG_DIR . '/visits.old.jsonl');
    }

    $line = json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    if ($line !== false) {
        @file_put_contents($file, $line . "\n", FILE_APPEND | LOCK_EX);
    }
}

http_response_code(204);
