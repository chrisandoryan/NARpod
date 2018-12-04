import java.util.*;

public class T108_JavaLU{
	public static void main (String[] args){
		Scanner scan = new Scanner (System.in);

		Random rand = new Random();

		String Username;
        String Command_name;
        String Directory;
        String Old_name;
        String New_name;
        String File_name;
        String IP_address;
        String Current_active_directory;
        String Destination;
        int packet_number;
        int ping_time;

		Vector <String> vUsername                    = new Vector <String>();
        Vector <String> vCommand_name                = new Vector <String>();
        Vector <String> vDirectory                   = new Vector <String>();
        Vector <String> vOld_name                    = new Vector <String>();
        Vector <String> vNew_name                    = new Vector <String>();
        Vector <String> vFile_name                   = new Vector <String>();
        Vector <String> vIP_address                  = new Vector <String>();
        Vector <String> vCurrent_Active_Directory    = new Vector <String>();
        Vector <String> vDestination                 = new Vector <String>();
        Vector <Integer> vPacket_number              = new Vector <Integer>();
        Vector <Integer> vDestination                = new Vector <Integer>();




    switch (choose){
				case 1:

                do{
			System.out.println("Login as: ");
			System.out.println("   @sudoers:/home$");


			try{
				choose = scan.nextInt(); scan.nextLine();
			}

			catch (Exception e){
					choose = 0;
					System.out.println ("Login as : ");
                    System.out.println ("Login as: @sudoers:/home$");
				}

                if(strstr("cd home") || strstr("cd etc") ||strstr("cd bin") ||strstr("cd iforgot")){
                    System.out.println("  @sudoers:/bin$");
                }
                else{
                    System.out.println("Command not found");
                }


	}while();


				break;

				case 2:
				break;

				case 3:
				break;

				case 4:
				break;

				case 5:
				break;

                case 6:
				break;

			}
		} while (choose != 7);


}