<?php
define('CLI_SCRIPT', true);
require(dirname(__DIR__, 2) . '/config.php');
$file = __DIR__ . '/control-probe-state.json';
if (($argv[1] ?? '') === 'restore') {
    $snapshot = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
    foreach ($snapshot as $key => $value) {
        $value === false ? unset_config($key, 'theme_moon') : set_config($key, $value, 'theme_moon');
    }
} else {
    $changes = [
        'theme_primary_custom' => '{"light":"#123456","dark":"#123456"}',
        'theme_secondary_custom' => '{"light":"#345678","dark":"#345678"}',
        'theme_yellow' => '#ffdd88',
        'body_typography_options' => '{"font_face":"Georgia, serif","font_size":{"global":"16"},"font_size_unit":{"global":"px"}}',
        'h1_typography' => 'custom',
        'h1_typography_options' => '{"font_face":"Georgia, serif","font_size":{"global":"37"},"font_size_unit":{"global":"px"}}',
        'logo_type' => 'text', 'logo_text' => 'Moon control test',
    ];
    $snapshot = [];
    foreach ($changes as $key => $value) {
        $snapshot[$key] = get_config('theme_moon', $key);
    }
    file_put_contents($file, json_encode($snapshot));
    foreach ($changes as $key => $value) {
        set_config($key, $value, 'theme_moon');
    }
}
theme_reset_all_caches();
echo "Control probe updated.\n";
