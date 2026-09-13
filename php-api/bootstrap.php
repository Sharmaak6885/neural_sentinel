<?php

declare(strict_types=1);

$projectRoot = dirname(__DIR__);
$databasePath = $projectRoot . DIRECTORY_SEPARATOR . 'database' . DIRECTORY_SEPARATOR . 'sentinel_grid_platform.sqlite3';
$schemaPath = $projectRoot . DIRECTORY_SEPARATOR . 'database' . DIRECTORY_SEPARATOR . 'schema.sql';
$seedPath = $projectRoot . DIRECTORY_SEPARATOR . 'database' . DIRECTORY_SEPARATOR . 'seed.sql';

if (!is_dir(dirname($databasePath))) {
    mkdir(dirname($databasePath), 0777, true);
}

$pdo = new PDO('sqlite:' . $databasePath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo->exec('PRAGMA foreign_keys = ON');
$pdo->exec('PRAGMA journal_mode = MEMORY');
$pdo->exec('PRAGMA temp_store = MEMORY');
$pdo->exec('PRAGMA synchronous = NORMAL');

initialize_database($pdo, $schemaPath, $seedPath);

function initialize_database(PDO $pdo, string $schemaPath, string $seedPath): void
{
    $pdo->exec(file_get_contents($schemaPath));
    $count = (int) $pdo->query('SELECT COUNT(*) FROM site_settings')->fetchColumn();

    if ($count === 0) {
        $pdo->exec(file_get_contents($seedPath));
    }
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function fetch_all(PDO $pdo, string $sql, array $params = []): array
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    return $statement->fetchAll();
}

function fetch_settings(PDO $pdo): array
{
    $rows = fetch_all($pdo, 'SELECT setting_key, setting_value FROM site_settings');
    $settings = [];

    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }

    return $settings;
}

function load_dashboard_payload(PDO $pdo): array
{
    $settings = fetch_settings($pdo);
    $feedSetRows = fetch_all($pdo, 'SELECT id FROM feed_sets ORDER BY display_order');
    $feedSets = [];
    $stories = fetch_all($pdo, 'SELECT id, title, text FROM case_stories ORDER BY display_order');

    foreach ($feedSetRows as $feedSetRow) {
        $feedSets[] = fetch_all(
            $pdo,
            'SELECT title, text, tag FROM feed_items WHERE set_id = :set_id ORDER BY display_order',
            [':set_id' => $feedSetRow['id']]
        );
    }

    foreach ($stories as &$story) {
        $story['kpis'] = fetch_all(
            $pdo,
            'SELECT label, value FROM case_story_kpis WHERE story_id = :story_id ORDER BY display_order',
            [':story_id' => $story['id']]
        );
        unset($story['id']);
    }

    return [
        'heroSignal' => [
            'label' => $settings['priority_advisory_label'] ?? 'Priority Advisory',
            'headline' => $settings['priority_advisory_headline'] ?? 'Credential-stuffing traffic spike detected in retail sector.',
            'linkText' => $settings['priority_advisory_link_text'] ?? 'View response pattern',
            'linkTarget' => $settings['priority_advisory_url'] ?? '#stories',
        ],
        'metrics' => fetch_all($pdo, 'SELECT label, value, suffix FROM metrics ORDER BY display_order'),
        'regions' => fetch_all($pdo, 'SELECT name, sector, level FROM regions ORDER BY display_order'),
        'feedSets' => $feedSets,
        'services' => fetch_all($pdo, 'SELECT title, text, tag FROM services ORDER BY display_order'),
        'timeline' => fetch_all($pdo, 'SELECT title, text FROM timeline_steps ORDER BY display_order'),
        'maturity' => [
            'score' => (int) ($settings['maturity_score'] ?? 86),
            'label' => $settings['maturity_label'] ?? 'Adaptive',
        ],
        'scoreBars' => fetch_all($pdo, 'SELECT label, value FROM score_bars ORDER BY display_order'),
        'stories' => $stories,
    ];
}

function read_json_input(): array
{
    $raw = file_get_contents('php://input');

    if ($raw === false || $raw === '') {
        return $_POST;
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $_POST;
}
