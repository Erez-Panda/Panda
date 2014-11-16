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
	String address;
	public enum Type {MEDREP, PHARMA, DOCTOR};
	@Index private String type;
	String specialty;
	String companyName;
	String contantPerson;
	String imageUrl;
	@Index String status;
	@Index int rating;
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
	public void update(User user) {
		if (null != user.getFirstName()){this.firstName = user.getFirstName();}
		if (null != user.getLastName()){this.lastName = user.getLastName();	}
		if (null != user.getEmail()){this.email = user.getEmail() ;}
		if (null != user.getPassword()){this.password = user.getPassword();	}
		if (null != user.getPhone()){this.phone = user.getPhone();}
		if (null != user.specialty){this.specialty = user.specialty;}
		if (null != user.companyName){this.companyName = user.companyName;}
		if (null != user.contantPerson){this.contantPerson = user.contantPerson;}
		if (null != user.address){this.address = user.address;}
		if (null != user.imageUrl){this.imageUrl = user.imageUrl;}
	}
	
}
