package com.panda.video.server;

import java.util.Date;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;

@Entity
public class User {
	private String firstName;
	private String lastName;
	@Id	private String email;
	private String password;
	private String phone;
	public enum Type {MEDREP, PHARMA, DOCTOR};
	private String type;
	private String specialty;
	private Date created;
	private String companyName;
	private String contantPerson;
	@Load Ref<Profile> profile;
	
    public Profile getProfile() { return profile.get(); }
    public void setProfile(Profile value) { profile = Ref.create(value); }
    
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
	
	public void Created(){
		created = new Date();
	}
}
