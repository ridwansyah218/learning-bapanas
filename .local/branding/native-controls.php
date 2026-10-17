<?php
define('CLI_SCRIPT', true);
require(dirname(__DIR__, 2) . '/config.php');
$old = get_config('theme_moon');
if (!file_exists(__DIR__ . '/settings-before-native.json')) {
    file_put_contents(__DIR__ . '/settings-before-native.json', json_encode($old, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}
$url = $CFG->wwwroot . '/branding/bapanas/logo-padi.svg';
foreach (['logo_type' => 'image', 'default_logo' => $url, 'mobile_logo' => $url, 'default_logo_width' => '350px',
    'default_logo_height' => '64px', 'mobile_logo_width' => '220px', 'mobile_logo_height' => '45px'] as $key => $value) {
    set_config($key, $value, 'theme_moon');
}
// Use Moon's local/system font option, without a fixed SASS font override.
$typography = json_encode(['font_face' => 'Arial, Helvetica, sans-serif', 'alt_font_face' => '',
    'font_size' => ['global' => '16'], 'font_size_unit' => ['global' => 'px'], 'line_height' => ['global' => '1.7'],
    'line_height_unit' => ['global' => 'em'], 'font_weight' => '400', 'text_transform' => 'none']);
set_config('body_typography', 'custom', 'theme_moon');
set_config('body_typography_options', $typography, 'theme_moon');
$overrides = json_decode($old->sass_overrides ?? '[]', true) ?? [];
$overrides = array_values(array_filter($overrides, fn($item) => ltrim($item['variable'] ?? '', '$') !== 'font-family-sans-serif'));
set_config('sass_overrides', json_encode($overrides), 'theme_moon');
$head = preg_replace('~<!-- PADI Bapanas branding -->.*?<!-- /PADI Bapanas branding -->~s', '', $CFG->additionalhtmlhead ?? '');
$head .= "\n<!-- PADI Bapanas branding -->" . '<link rel="stylesheet" href="' . s($CFG->wwwroot . '/branding/bapanas/padi.css?v=' . time()) . '"><!-- /PADI Bapanas branding -->';
set_config('additionalhtmlhead', $head);
theme_reset_all_caches();
echo "Moon native controls enabled; layout content preserved.\n";
