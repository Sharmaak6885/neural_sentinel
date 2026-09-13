<?php

declare(strict_types=1);

require __DIR__ . DIRECTORY_SEPARATOR . 'bootstrap.php';

$payload = read_json_input();
$name = trim((string) ($payload['name'] ?? ''));
$email = trim((string) ($payload['email'] ?? ''));
$company = trim((string) ($payload['company'] ?? ''));
$priority = trim((string) ($payload['priority'] ?? 'Threat Monitoring'));
$message = trim((string) ($payload['message'] ?? ''));

if ($name === '' || $email === '') {
    json_response(['message' => 'Name and email are required.'], 400);
}

$statement = $pdo->prepare(
    'INSERT INTO contact_submissions (name, email, company, priority, message) VALUES (:name, :email, :company, :priority, :message)'
);
$statement->execute([
    ':name' => $name,
    ':email' => $email,
    ':company' => $company,
    ':priority' => $priority,
    ':message' => $message,
]);

json_response(
    ['message' => sprintf('Thanks %s. Your cybersecurity request has been stored in the SQL queue.', $name)],
    201
);

