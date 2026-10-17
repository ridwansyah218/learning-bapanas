<?php
// This file is part of Moodle - https://moodle.org/
// Moodle is distributed under the GNU GPL v3 or later.

/**
 * Theme override of the Moon "Full Header" element.
 *
 * The local_moon version prints nothing when "only_admin" is off; this makes the
 * switch work as labelled: on = site admins only, off = every visitor.
 *
 * @package   theme_moon
 */

defined('MOODLE_INTERNAL') || die;
global $OUTPUT;
$onlyadmin = (int) $this->params->get('only_admin', 1);
if ($onlyadmin !== 1 || is_siteadmin()) {
    echo $OUTPUT->full_header();
}
