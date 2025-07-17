<?php
// Define que a resposta será no formato JSON
header('Content-Type: application/json');

/*
 * ARQUIVO DE CONFIGURAÇÃO DO BANCO DE DADOS
 *
 * Preencha com as mesmas credenciais que usaria no arquivo .env.
 * IMPORTANTE: Este ficheiro contém informações sensíveis.
 */
$db_config = [
    'host'     => 'limegreen-snail-885269.hostingersite.com', // Geralmente 'localhost'
    'username' => 'u286291774_form',
    'password' => 'Etropu$$0%',
    'dbname'   => 'u286291774_form_insidetec'
];

// --- FIM DA CONFIGURAÇÃO ---

// Conecta-se ao banco de dados usando MySQLi
$conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['dbname']);

// Verifica a conexão
if ($conn->connect_error) {
    // Se a conexão falhar, envia uma resposta de erro genérica
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor.']);
    exit(); // Para a execução do script
}

// Obtém os dados enviados pelo formulário (via POST)
$input = json_decode(file_get_contents('php://input'), true);

// Validação básica no servidor
if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
    echo json_encode(['success' => false, 'message' => 'Nome, e-mail e mensagem são obrigatórios.']);
    exit();
}

// Sanitiza os dados para segurança
$name = htmlspecialchars(strip_tags($input['name']));
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$phone = isset($input['phone']) ? htmlspecialchars(strip_tags($input['phone'])) : null;
$service = isset($input['service']) ? htmlspecialchars(strip_tags($input['service'])) : null;
$message = htmlspecialchars(strip_tags($input['message']));

// Prepara a instrução SQL para inserir os dados
$stmt = $conn->prepare("INSERT INTO contacts (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)");
// 'sssss' significa que estamos a passar 5 variáveis do tipo string
$stmt->bind_param("sssss", $name, $email, $phone, $service, $message);

// Executa a instrução e verifica o resultado
if ($stmt->execute()) {
    // Sucesso
    echo json_encode(['success' => true, 'message' => 'Mensagem enviada com sucesso!']);
} else {
    // Falha
    echo json_encode(['success' => false, 'message' => 'Ocorreu um erro ao guardar a sua mensagem.']);
}

// Fecha a declaração e a conexão
$stmt->close();
$conn->close();

?>
