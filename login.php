<?php
include 'database.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email']);
$password = trim($data['password']);

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit;
}

// Verificar si existe el usuario
$stmt = $pdo->prepare("SELECT id, name, password FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
    exit;
}

// Verificar contraseña
if (password_verify($password, $user['password'])) {
    // Aquí puedes iniciar sesión, setear variables de sesión, etc.
    // Por simplicidad, solo devolvemos éxito y el nombre del usuario
    echo json_encode(['success' => true, 'message' => 'Login exitoso.', 'name' => $user['name']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
}
