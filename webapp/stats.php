<?php


require_once __DIR__ . '/_bootstrap.php';

$uid = require_login();


$stmt = db()->prepare(
    "SELECT DATE(created_at) AS d, COUNT(*) AS c
       FROM activity
      WHERE user_id = ? AND type = 'motion'
        AND created_at >= (CURDATE() - INTERVAL 6 DAY)
   GROUP BY DATE(created_at)"
);
$stmt->execute([$uid]);

$counts = [];
foreach ($stmt->fetchAll() as $r) {
    $counts[$r['d']] = (int) $r['c'];
}


$labels = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];   
$out = [];
for ($i = 6; $i >= 0; $i--) {
    $ts  = strtotime("-$i day");
    $key = date('Y-m-d', $ts);
    $out[] = [
        'date'  => $key,
        'label' => $labels[(int) date('w', $ts)],
        'count' => $counts[$key] ?? 0,
    ];
}

send($out);
