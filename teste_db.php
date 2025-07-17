<?php
// TESTE DE CONEXÃO COM O BANCO DE DADOS
// Execute este arquivo para verificar se a conexão está funcionando

header('Content-Type: application/json');

$db_config = [
    'host'     => 'localhost',
    'username' => 'u286291774_form',
    'password' => 'Etropu$$0%',
    'dbname'   => 'u286291774_form_insidetec'
];

echo "<h1>Teste de Conexão - Teraware</h1>";

try {
    // Teste de conexão
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['dbname']);
    
    if ($conn->connect_error) {
        throw new Exception("Erro de conexão: " . $conn->connect_error);
    }
    
    echo "<p style='color: green'>✅ Conexão com banco de dados: SUCESSO</p>";
    echo "<p>Servidor: " . $db_config['host'] . "</p>";
    echo "<p>Database: " . $db_config['dbname'] . "</p>";
    echo "<p>Username: " . $db_config['username'] . "</p>";
    
    // Verificar se a tabela existe
    $result = $conn->query("SHOW TABLES LIKE 'contacts'");
    if ($result->num_rows > 0) {
        echo "<p style='color: green'>✅ Tabela 'contacts': EXISTE</p>";
        
        // Verificar estrutura da tabela
        $structure = $conn->query("DESCRIBE contacts");
        echo "<h3>Estrutura da Tabela:</h3>";
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Chave</th><th>Padrão</th></tr>";
        
        while ($row = $structure->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['Field'] . "</td>";
            echo "<td>" . $row['Type'] . "</td>";
            echo "<td>" . $row['Null'] . "</td>";
            echo "<td>" . $row['Key'] . "</td>";
            echo "<td>" . $row['Default'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Contar registros
        $count = $conn->query("SELECT COUNT(*) as total FROM contacts");
        $total = $count->fetch_assoc()['total'];
        echo "<p>📊 Total de registros: " . $total . "</p>";
        
        // Mostrar últimos 5 registros
        if ($total > 0) {
            echo "<h3>Últimos 5 Registros:</h3>";
            $records = $conn->query("SELECT * FROM contacts ORDER BY id DESC LIMIT 5");
            echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
            echo "<tr><th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th><th>Serviço</th><th>Data</th></tr>";
            
            while ($row = $records->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row['id'] . "</td>";
                echo "<td>" . $row['name'] . "</td>";
                echo "<td>" . $row['email'] . "</td>";
                echo "<td>" . $row['phone'] . "</td>";
                echo "<td>" . $row['service'] . "</td>";
                echo "<td>" . $row['created_at'] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
        
    } else {
        echo "<p style='color: orange'>⚠️ Tabela 'contacts': NÃO EXISTE</p>";
        echo "<p>Vou criar a tabela agora...</p>";
        
        $create_table = "CREATE TABLE contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            service VARCHAR(100),
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        
        if ($conn->query($create_table)) {
            echo "<p style='color: green'>✅ Tabela 'contacts' criada com sucesso!</p>";
        } else {
            echo "<p style='color: red'>❌ Erro ao criar tabela: " . $conn->error . "</p>";
        }
    }
    
    // Teste de inserção
    echo "<h3>Teste de Inserção:</h3>";
    $test_data = [
        'name' => 'Teste Conexão',
        'email' => 'teste@conexao.com',
        'phone' => '11999999999',
        'service' => 'teste',
        'message' => 'Mensagem de teste da conexão - ' . date('Y-m-d H:i:s')
    ];
    
    $stmt = $conn->prepare("INSERT INTO contacts (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $test_data['name'], $test_data['email'], $test_data['phone'], $test_data['service'], $test_data['message']);
    
    if ($stmt->execute()) {
        echo "<p style='color: green'>✅ Inserção de teste: SUCESSO (ID: " . $conn->insert_id . ")</p>";
    } else {
        echo "<p style='color: red'>❌ Erro na inserção: " . $stmt->error . "</p>";
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo "<p style='color: red'>❌ Erro: " . $e->getMessage() . "</p>";
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}

echo "<hr>";
echo "<h3>Informações do Servidor:</h3>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>MySQL Extension: " . (extension_loaded('mysqli') ? 'Carregada' : 'Não carregada') . "</p>";
echo "<p>Timezone: " . date_default_timezone_get() . "</p>";
echo "<p>Data/Hora atual: " . date('Y-m-d H:i:s') . "</p>";
?>