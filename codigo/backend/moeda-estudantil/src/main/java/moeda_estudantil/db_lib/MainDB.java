package moeda_estudantil.db_lib;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class MainDB {
    static String url;
    static String userName;
    static String password;
    static Connection _connection;

    /**
     * Inicia a configuracao dos parametros de conexao do PostgreSQL atraves do arquivo 'application.properties'.
     * @throws IOException
     */    
    public static boolean initialize() throws IOException {
        Properties props = new Properties();
        try (InputStream in = MainDB.class.getResourceAsStream("/application.properties")) {
            if (in == null) {
                throw new IllegalStateException("application.properties não encontrado no classpath");
            }
            props.load(in);
        }

        url = props.getProperty("spring.datasource.url");
        userName = props.getProperty("spring.datasource.username");
        password = props.getProperty("spring.datasource.password");

        if(checkProps()) {
            System.out.println("application.properties configurado com sucesso!");
            return true;
        }
        return false;
    }

    /**
     * Efetua a conexao com o banco de dados PostgreSQL.
     * @return Conexao com o banco de dados PostgreSQL.
     * @throws SQLException
     */
    public static Connection connect() throws SQLException {
        if(_connection !=null && !_connection.isClosed()){
            return _connection;
        }
        if(!checkProps())
            return null;
        
        try {
            // Open a connection
            return DriverManager.getConnection(url, userName, password);
        } catch (SQLException  e) {
            System.err.println(e.getMessage());
            return null;
        }
    }


    /**
     * Efetua os cheques dos parametros de conexao verificando se estao validos.
     * @return True se todos seus parametros estao validos.
     */
    static boolean checkProps() {
        if(url == null || userName == null || password == null) {
            System.out.println("application.properties não possui as propriedades necessárias.");
            return false;
        }
        return true;
    }

    /**
     * Efetua uma query 'SELECT *' da tabela 'tableName', junto com seu Schema.
     * @param tableName tabela a ser selecionada. (ex: finessesportz.cliente)
     * @return Lista com as linhas adquiridas de todas as colunas da tabela selecionada.
     * @throws SQLException
     */
    public static List<Map<String,Object>> selectAll(Connection conn, String tableName) throws SQLException {
        String sql = "SELECT * FROM " + tableName;
        return query(conn, sql);
    }

    /* public static List<Map<String,Object>> selectCredencial(Connection conn, String email, String senha) throws SQLException {
        String sql = "SELECT * FROM finessesportz.credenciais WHERE login = '" + email + "' AND senha_hash = '" + senha + "'";
        return query(conn, sql);
    }

    public static boolean validateCredencial(Connection conn, String email, String senha) throws SQLException {
        List<Map<String,Object>> results = selectCredencial(conn, email, senha);
        return results.size() > 0;
    }

    public static String createCredencial(Connection conn, String email, String senha) throws SQLException {
        if(email == null || email.isEmpty() || senha == null || senha.isEmpty()){
            return "invalido";
        }

        Map<String,Object> data = new HashMap<>();
        data.put("login", email);
        data.put("senha_hash", senha);

        List<Map<String,Object>> results = selectCredencial(conn, email, senha);
        if(results.size() > 0){
            return "existente";
        }

        insert(conn, "finessesportz.credenciais", data);
        //Retorna id da credencial criada
        results = query(conn,"SELECT * FROM finessesportz.credenciais WHERE login = '" + email + "'");
        String id = results.get(0).get("id").toString();
        return id;
    } */


    /**
     * Insere uma nova linha na tabela 'tableName', com os dados fornecidos no Map 'data'.
     * @param conn Conexao com o banco de dados PostgreSQL.
     * @param tableName tabela a ser inserida. (ex: finessesportz.credenciais)
     * @param data Map com os dados a serem inseridos na nova linha. A chave do Map é o nome da coluna e o valor é o valor a ser inserido.
     * @throws SQLException
     */
    public static void insert(Connection conn, String tableName, Map<String,Object> data) throws SQLException {
        StringBuilder sql = new StringBuilder("INSERT INTO " + tableName + " (");
        StringBuilder placeholders = new StringBuilder();
        List<Object> values = new ArrayList<>();

        for (String column : data.keySet()) {
            sql.append(column).append(", ");
            placeholders.append("?, "); // '?' é um placeholder para PreparedStatement, utilizado por 'values'.
            values.add(data.get(column));
        }

        // Remove a última vírgula e espaço. TODO: melhorar
        sql.setLength(sql.length() - 2);
        placeholders.setLength(placeholders.length() - 2);

        sql.append(") VALUES (").append(placeholders).append(")");

        execute(conn, sql.toString(), values);
    }

    /**
     * Remove linhas da tabela 'tableName' que satisfaçam a condição 'condition'.
     * @param conn Conexao com o banco de dados PostgreSQL.
     * @param tableName tabela a ser removida. (ex: finessesportz.credenciais)
     * @param condition Condição SQL para remoção (ex: "login = ?").
     * @param params Valores a serem inseridos na condição SQL.
     * @throws SQLException
     */
    public static void remove(Connection conn, String tableName, String condition, Object... params) throws SQLException {
        String sql = "DELETE FROM " + tableName + " WHERE " + condition;
        execute(conn, sql, Arrays.asList(params));
    }

    /**
     * Executa uma query SQL (TODO: nao-retornavel) com parametros.
     * @param conn Conexao com o banco de dados PostgreSQL.
     * @param sql Query SQL a ser executada.
     * @param values Valores a serem inseridos na query SQL.
     * @throws SQLException
     */
    private static void execute(Connection conn, String sql, List<Object> values) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            for (int i = 0; i < values.size(); i++) {
                ps.setObject(i + 1, values.get(i));
            }
            ps.executeUpdate();
        }
    }



    /**
     * Efetua uma query SQL com parametros.
     * @param conn Conexao com o banco de dados PostgreSQL.
     * @param sql Query SQL a ser executada.
     * @param params Parametros a serem inseridos na query SQL.
     * @return Lista com as linhas adquiridas de todas as colunas da tabela selecionada.
     * @throws SQLException
     */
    public static List<Map<String,Object>> query(Connection conn, String sql, Object... params) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            for (int i = 0; i < params.length; i++) ps.setObject(i + 1, params[i]);
            try (ResultSet rs = ps.executeQuery()) {
                ResultSetMetaData md = rs.getMetaData();
                int cols = md.getColumnCount();
                List<Map<String,Object>> rows = new ArrayList<>();
                while (rs.next()) {
                    Map<String,Object> row = new LinkedHashMap<>(cols);
                    for (int c = 1; c <= cols; c++) {
                        row.put(md.getColumnLabel(c), rs.getObject(c));
                    }
                    rows.add(row);
                }
                return rows;
            }
        }
    }

    public static void main(String[] args) throws Exception {
        initialize();
        try (Connection connection = connect()) {
            System.out.println("Tabela antes do insert:");
            List<Map<String, Object>> rows = selectAll(connection,"finessesportz.credenciais");
            for (Map<String, Object> r : rows) {
                System.out.println(r);
            }
            
            Map<String, Object> data = new HashMap<>();
            data.put("login", "user123");
            data.put("senha_hash", "pass123");
            insert(connection, "finessesportz.credenciais", data);
            
            System.out.println("Tabela depois do insert:");
            rows = selectAll(connection,"finessesportz.credenciais");
            for (Map<String, Object> r : rows) {
                System.out.println(r);
            }
            
            //Remove credencial inserida.
            remove(connection, "finessesportz.credenciais", "login = ?", "user123");
            
            System.out.println("Tabela depois do remove:");
            rows = selectAll(connection,"finessesportz.credenciais");
            for (Map<String, Object> r : rows) {
                System.out.println(r);
            }
        }
    }

    /* public static String createUser(Connection conn, String nome, String cpf, String cep, String telefone, String idCredencial) {
        if(nome == null || nome.isEmpty() || cpf == null || cpf.isEmpty()){
            return "invalido";
        }

        Map<String,Object> data = new HashMap<>();

        data.put("nome", nome);
        data.put("cpf", Long.parseLong(cpf));
        data.put("cep", Long.parseLong(cep));
        data.put("telefone", Long.parseLong(telefone));
        data.put("credenciais_id", Integer.parseInt(idCredencial));

        try {
            insert(conn, "finessesportz.cliente", data);
            return "sucesso";
        } catch (SQLException e) {
            e.printStackTrace();
            return "error";
        }
    } */
}
