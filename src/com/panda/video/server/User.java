package com.panda.video.server;

import java.util.ArrayList;
import java.util.Date;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Load;

@Entity
public class User extends PandaEntity{
	@Id Long userId;
	private String firstName;
	private String lastName;
	@Index private String email;
	private String password;
	private String phone;
	public enum Type {MEDREP, PHARMA, DOCTOR};
	@Index private String type;
	private String specialty;
	private String companyName;
	private String contantPerson;
	@Load Ref<Profile> profile;
	@Load ArrayList<Ref<Call>> callList = new ArrayList<Ref<Call>>();
	@Load ArrayList<Ref<Product>> productList = new ArrayList<Ref<Product>>();
	@Load ArrayList<Ref<Training>> trainingList = new ArrayList<Ref<Training>>();
	
    public ArrayList<Ref<Call>> getCalls() { return callList; }
    public void addCall(Call value) { callList.add(Ref.create(value)); }
    
    public ArrayList<Ref<Product>> getProducts() { return productList; }
    public void addProduct(Product value) { productList.add(Ref.create(value)); }
    
    public ArrayList<Ref<Training>> getTrainings() { return trainingList; }
    public void addTraining(Training value) { trainingList.add(Ref.create(value)); }
    
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
	
}
