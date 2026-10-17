<?php
// Replace the site URL inside Moon layout files (theme_moon main_layouts / layouts).
// Moodle's "Search and replace" tool (admin/tool/replace) only changes the database;
// Moon stores its layouts as files in moodledata, so run this after moving servers.
//
// Usage (from the project root, after config.php has the NEW wwwroot):
//   php .local/branding/replace-url.php --from=http://localhost/learning-bapanas
//   php .local/branding/replace-url.php --from=http://localhost/learning-bapanas --to=https://padi.example.go.id
// --to defaults to $CFG->wwwroot.
define('CLI_SCRIPT', true);
require(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/clilib.php');

[$options] = cli_get_params(['from' => '', 'to' => '', 'help' => false], ['h' => 'help']);
if ($options['help'] || $options['from'] === '') {
    echo "Usage: php .local/branding/replace-url.php --from=OLD_URL [--to=NEW_URL]\n";
    exit($options['help'] ? 0 : 1);
}
$from = rtrim($options['from'], '/');
$to = rtrim($options['to'] !== '' ? $options['to'] : $CFG->wwwroot, '/');
if ($from === $to) {
    cli_error('--from and --to are the same.');
}

$fs = get_file_storage();
$context = context_system::instance();
$changed = 0;
foreach (['main_layouts', 'layouts'] as $area) {
    foreach ($fs->get_area_files($context->id, 'theme_moon', $area, false, 'filename', false) as $file) {
        $content = $file->get_content();
        // Layouts are JSON, where "/" may be escaped as "\/".
        $new = str_replace([$from, str_replace('/', '\/', $from)], [$to, str_replace('/', '\/', $to)], $content);
        if ($new === $content) {
            continue;
        }
        $record = [
            'contextid' => $file->get_contextid(), 'component' => $file->get_component(),
            'filearea' => $file->get_filearea(), 'itemid' => $file->get_itemid(),
            'filepath' => $file->get_filepath(), 'filename' => $file->get_filename(),
        ];
        $file->delete();
        $fs->create_file_from_string($record, $new);
        echo "updated {$area}{$record['filepath']}{$record['filename']}\n";
        $changed++;
    }
}
theme_reset_all_caches();
echo "{$changed} Moon layout file(s) updated: {$from} -> {$to}\n";
