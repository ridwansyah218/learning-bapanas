<?php
define('CLI_SCRIPT', true);
require(__DIR__ . '/../../config.php');
$before = [];
foreach (['frontpage', 'frontpageloggedin'] as $key) {
    $before[$key] = get_config('core', $key);
}
file_put_contents(__DIR__ . '/home-order-before.json', json_encode($before, JSON_PRETTY_PRINT));
foreach ($before as $key => $value) {
    $parts = explode(',', $value);
    if (in_array('7', $parts, true) && in_array('6', $parts, true)) {
        $parts = array_values(array_filter($parts, fn($part) => $part !== '7'));
        array_splice($parts, array_search('6', $parts, true), 0, ['7']);
        set_config($key, implode(',', $parts));
        echo $key . ': ' . implode(',', $parts) . PHP_EOL;
    }
}
