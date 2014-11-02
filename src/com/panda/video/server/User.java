package com.panda.video.server;

public class User {
	private String firstName;
	private String lastName;
	private String email;
	private String password;
	private String phone;
	public enum Type {MEDREP, PHARMA, DOCTOR};
	private Type type;
	
	
	public User(String first, String last, String mail, String pass, String ph, Type t){
		firstName = first;
		lastName = last;
		email = mail;
		password = pass;
		phone = ph;
		type = t;
	}
	
	public User(){
		
	}
	
	public String getFirstName(){
		return firstName;
	}
	
	public boolean setFirstName(String name){
		firstName = name;
		return true;
	}
	
	public String getLastName(){
		return lastName;
	}
	
	public boolean setLastName(String name){
		lastName = name;
		return true;
	}
	
	public String getPassword(){
		return password;
	}
	
	public boolean setPassword(String pass){
		password = pass;
		return true;
	}
	
	public String getEmail(){
		return email;
	}
	
	public boolean setEmail(String mail){
		email = mail;
		return true;
	}
	public String getPhone(){
		return phone;
	}
	
	public boolean setPhone(String ph){
		phone = ph;
		return true;
	}
	
}
