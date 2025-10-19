package moeda_estudantil;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import moeda_estudantil.db_lib.MainDB;

@SpringBootApplication
public class MoedaEstudantilApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoedaEstudantilApplication.class, args);
		try{
			System.out.println("\n\n\n");
			MainDB.initialize();
			var conn = MainDB.connect();
			System.out.println("Back-end iniciado com sucesso!");
		}catch(Exception e){
			e.printStackTrace();
		}
	}

}
