package com.panda.video.server;

import com.google.gson.Gson;

public class JSON {
	public String toJson(Object obj) {
		Gson gson = new Gson();
		String json = gson.toJson(obj);
		return json;
	}
	public static User constructUser(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, User.class);
	}
	
	public static Message constructMessage(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, Message.class);
	}
	
	public static Profile constructProfile(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, Profile.class);
	}
	
	public static MedRepProfile constructMedProfile(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, MedRepProfile.class);
	}
	
	public static DoctorProfile constructDocProfile(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, DoctorProfile.class);
	}
	
	public static PharmaProfile constructPharmaProfile(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, PharmaProfile.class);
	}
	
	public static Call constructCall(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, Call.class);
	}
	
	public static Product constructProduct(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, Product.class);
	}
	
	public static Resource constructResource(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, Resource.class);
	}
	
	public static Training constructTraining(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, Training.class);
	}
	public static StaticEntity constructStaticEntity(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, StaticEntity.class);
	}
	
	public static PostCall constructPostCall(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, PostCall.class);
	}
	
	public static CallRequest constructCallRequest(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, CallRequest.class);
	}
	
	public static Question constructQuestion(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, Question.class);
	}
	

}
