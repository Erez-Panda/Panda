package com.panda.video.server;

import com.google.gson.Gson;

public class JSON {
	public String toJson(Object obj) {
		Gson gson = new Gson();
		String json = gson.toJson(obj);
		return json;
	}
	public static User constructFromJson(String json){
		Gson gson = new Gson();
		return gson.fromJson(json, User.class);
	}

}
