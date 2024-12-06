<?php
include 'database.php';

$data = json_decode(file_get_contents('php://input'), true);
$name = trim($data['name']);
$email = trim($data['email']);
$password = trim($data['password']);

if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit;
}

// Verificar si ya existe un usuario con el mismo correo
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if ($user) {
    echo json_encode(['success' => false, 'message' => 'Ya existe una cuenta con este correo.']);
    exit;
}

// Insertar nuevo usuario
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
$success = $stmt->execute([
    'name' => $name,
    'email' => $email,
    'password' => $hashedPassword
]);

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Registro exitoso.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al registrar el usuario.']);
}
