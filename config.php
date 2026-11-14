<?php
/**
 * ZYNTSHOP — VISITOR LOG SETTINGS
 *
 * 1) PALITAN ang ADMIN_PASSWORD bago i-upload (at least 8 characters).
 *    Habang "CHANGE_THIS_PASSWORD" pa rin, hindi gagana ang login.
 * 2) Buksan ang  https://your-site.com/visitors.php  para makita ang log.
 */

// Password para sa visitors.php
const ADMIN_PASSWORD = 'CHANGE_THIS_PASSWORD';

// Oras na ipapakita sa log
const LOG_TIMEZONE = 'Asia/Manila';

// Dito ise-save ang log. Mas safe kung nasa LABAS ng public folder,
// halimbawa: dirname(__DIR__) . '/zynt-logs'
const LOG_DIR = __DIR__ . '/logs';

// Kapag lumampas sa laki na ito, ililipat sa visits.old.jsonl (para hindi lumaki nang lumaki)
const MAX_LOG_BYTES = 5 * 1024 * 1024;

// true lang kung naka-Cloudflare o reverse proxy ang hosting mo.
// Kapag false, REMOTE_ADDR ang gagamitin (hindi madaling peke-in).
const TRUST_PROXY_IP = false;
