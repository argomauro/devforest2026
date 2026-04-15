<?php
declare(strict_types=1);

/**
 * Modulo registrazione DevFest — invio email via mail().
 * Modifica $mailTo e $mailFromHeader con indirizzi reali del dominio di hosting.
 */

function df_utf8_len(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

function df_utf8_substr(string $s, int $start, int $length): string
{
    return function_exists('mb_substr') ? mb_substr($s, $start, $length, 'UTF-8') : substr($s, $start, $length);
}

$mailTo = 'organizzatori@example.com';
/** Mittente visibile (molti hosting richiedono un dominio locale valido) */
$mailFromHeader = 'noreply@example.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html#registrazione', true, 303);
    exit;
}

$website = trim((string) ($_POST['website'] ?? ''));
if ($website !== '') {
    header('Location: index.html?reg=ok#registrazione', true, 303);
    exit;
}

$nome = trim((string) ($_POST['nome'] ?? ''));
$cognome = trim((string) ($_POST['cognome'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$emailConfirm = trim((string) ($_POST['email_confirm'] ?? ''));
$note = trim((string) ($_POST['note'] ?? ''));

$errors = [];

if ($nome === '' || df_utf8_len($nome) > 120) {
    $errors[] = 'Il nome è obbligatorio (max 120 caratteri).';
}
if ($cognome === '' || df_utf8_len($cognome) > 120) {
    $errors[] = 'Il cognome è obbligatorio (max 120 caratteri).';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Inserisci un indirizzo email valido.';
}
if ($emailConfirm === '') {
    $errors[] = 'Conferma l’indirizzo email.';
} elseif ($email !== $emailConfirm) {
    $errors[] = 'Le due email devono coincidere.';
}
if (df_utf8_len($note) > 4000) {
    $errors[] = 'Il campo note supera la lunghezza massima.';
}

if ($errors !== []) {
    http_response_code(422);
    header('Content-Type: text/html; charset=utf-8');
    $esc = static function (string $s): string {
        return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    };
    ?>
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Registrazione — errori</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0c1224; color: #e8ecff; margin: 0; padding: 2rem; line-height: 1.5; }
    .box { max-width: 520px; margin: 0 auto; background: rgba(18,28,52,.9); border: 1px solid rgba(234,67,53,.4); border-radius: 16px; padding: 1.5rem; }
    h1 { font-size: 1.15rem; margin: 0 0 1rem; color: #fecaca; }
    ul { margin: 0 0 1.25rem; padding-left: 1.2rem; }
    a { color: #93c5fd; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Non è stato possibile inviare il modulo</h1>
    <ul>
      <?php foreach ($errors as $msg): ?>
        <li><?= $esc($msg) ?></li>
      <?php endforeach; ?>
    </ul>
    <p><a href="index.html#registrazione">Torna al modulo di registrazione</a></p>
  </div>
</body>
</html>
    <?php
    exit;
}

$emailLine = str_replace(["\r", "\n", "%0a", "%0d", "%0A", "%0D"], '', $email);
$nomeLine = str_replace(["\r", "\n"], ' ', $nome);
$cognomeLine = str_replace(["\r", "\n"], ' ', $cognome);

$subject = '[DevFest Registrazione] ' . $nomeLine . ' ' . $cognomeLine;
$subject = str_replace(["\r", "\n"], '', $subject);
if (df_utf8_len($subject) > 200) {
    $subject = df_utf8_substr($subject, 0, 197) . '...';
}

$body = "Nuova registrazione — DevFest Basilicata 2026\r\n\r\n";
$body .= 'Nome: ' . $nome . "\r\n";
$body .= 'Cognome: ' . $cognome . "\r\n";
$body .= 'Email: ' . $email . "\r\n\r\n";
$body .= 'Note:' . "\r\n";
$body .= ($note !== '' ? $note : '(nessuna)') . "\r\n";

$fromSafe = str_replace(["\r", "\n"], '', $mailFromHeader);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $fromSafe,
    'Reply-To: ' . $emailLine,
    'X-Mailer: PHP/' . PHP_VERSION,
];

$sent = @mail($mailTo, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if ($sent) {
    header('Location: index.html?reg=ok#registrazione', true, 303);
} else {
    header('Location: index.html?reg=fail#registrazione', true, 303);
}
exit;
