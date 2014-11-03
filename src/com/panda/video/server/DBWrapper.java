package com.panda.video.server;

import java.util.ArrayList;
import java.util.Date;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

public class DBWrapper {
	// Get the Datastore Service
	private static DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

	/*
	public static String getUrlByFreqRange(long[] freqs, int range){
		Filter freqMinFilter =
				new FilterPredicate("freq0",
						FilterOperator.GREATER_THAN_OR_EQUAL,
						freqs[0] - range);

		Filter freqMaxFilter =
				new FilterPredicate("freq0",
						FilterOperator.LESS_THAN_OR_EQUAL,
						freqs[0] + range);

		//Use CompositeFilter to combine multiple filters
		Filter freqRangeFilter = CompositeFilterOperator.and(freqMinFilter, freqMaxFilter);


		// Use class Query to assemble a query
		Query q = new Query("QRUrl").setFilter(freqRangeFilter);

		// Use PreparedQuery interface to retrieve results
		PreparedQuery pq = datastore.prepare(q);
		String clientUrl = null;
		for (Entity result : pq.asIterable()) {
			if (null != result){
				// here we assume 3 freq
				long freq1 = (long)result.getProperty("freq1");
				if (freqs[1]+range >= freq1 && freqs[1]-range <= freq1){
					clientUrl = (String) result.getProperty("url");
				}	
			}
		}

		return clientUrl;
	}

	public static boolean isFreqRangeExist(long[] freqs, int range){
		String url = getUrlByFreqRange(freqs, range);
		if (null != url){
			return true;
		}
		return false;
	}

	public static long[] getFreqbyUrl(String url, int freqNum){
		Filter urlFilter = new FilterPredicate("url",FilterOperator.EQUAL,url);
		Query q = new Query("QRUrl").setFilter(urlFilter);
		PreparedQuery pq = datastore.prepare(q);
		Entity result = pq.asSingleEntity();
		long[] freqs = new long[freqNum];
		if (null != result){
			for (int i=0; i< freqNum; i++){
				freqs[i] = (long) result.getProperty("freq"+i);
			}
			return freqs;
		}
		freqs[0] = -1; // return error
		return freqs;

	}
	 */
	public static void cleanUserDB(){
		Query q = new Query("User");
		PreparedQuery pq = datastore.prepare(q);
		for (Entity result : pq.asIterable()) {
			datastore.delete(result.getKey());
		}
	}

	private static User buildUserFromEntity(Entity e){
		if (null != e){
			String fn = (String)e.getProperty("firstName");
			String ln = (String)e.getProperty("lastName");
			String mail = (String)e.getProperty("email");
			String pass = (String)e.getProperty("password");
			String ph = (String)e.getProperty("phone");
			String spl = (String)e.getProperty("specialty");
			String type = (String)e.getProperty("type");
			Date d = (Date)e.getProperty("created");
			User user = new User(fn, ln, mail, pass, ph, type,d, spl);
			return user;
		}
		return null;
	}

	public static ArrayList<User> listUserDB(){
		Query q = new Query("User");
		ArrayList<User> users = new ArrayList<User>();
		try{
			PreparedQuery pq = datastore.prepare(q);
			for (Entity result : pq.asIterable()) {
				users.add(buildUserFromEntity(result));
			}
		}catch (Exception e){}
		return users;
	}	

	public static boolean addUser(User user){
		Entity newUser = new Entity("User");
		newUser.setProperty("firstName", user.getFirstName());
		newUser.setProperty("lastName", user.getLastName());
		newUser.setProperty("email", user.getEmail());
		newUser.setProperty("password", user.getPassword());
		newUser.setProperty("phone", user.getPhone());
		newUser.setProperty("type", user.getType());
		newUser.setProperty("specialty", user.getSpecialty());
		Date bornDate = new Date();
		newUser.setProperty("created", bornDate);
		datastore.put(newUser);
		return true;
	}

	public static User getUser(String email){
		User user; 
		Filter emailFilter = new FilterPredicate("email",FilterOperator.EQUAL,email);
		Query q = new Query("User").setFilter(emailFilter);
		PreparedQuery pq = datastore.prepare(q);
		try {
			Entity result = pq.asSingleEntity();
			user = buildUserFromEntity(result);
			if (null != user){
				return user;
			}
		}catch (Exception e){
			System.out.print(e.getMessage());
			return null;
		}
		return null;

	}

}

