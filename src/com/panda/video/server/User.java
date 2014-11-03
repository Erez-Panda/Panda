package com.panda.video.server;

import java.util.Date;

public class User {
	private String firstName;
	private String lastName;
	private String email;
	private String password;
	private String phone;
	public enum Type {MEDREP, PHARMA, DOCTOR};
	private String type;
	private Date created;
	private String specialty;
	
	
	public User(String first, String last, String mail, String pass, String ph, String t, Date d, String spl){
		firstName = first;
		lastName = last;
		email = mail;
		password = pass;
		phone = ph;
		type = t;
		created = d;
		specialty = spl;
	}
	
	public User(User u){
		this.firstName = u.getFirstName();
		this.lastName = u.getLastName();
		this.email = u.getEmail();
		this.password = u.getPassword();
		this.phone = u.getPhone();
		this.type = u.getType();
		this.created = u.getCreated();
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
	
	public String getType(){
		return type;
	}
	
	public Date getCreated(){
		return created;
	}
	
	public String getSpecialty(){
		return specialty;
	}
}
