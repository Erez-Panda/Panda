package com.panda.video.server;

import static com.panda.video.server.OfyService.ofy;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class UserManagmentServlet extends HttpServlet {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -6690220531052390423L;

	@Override
	public void doPost(HttpServletRequest reqeust, HttpServletResponse response)
			throws IOException {

			String msgJson = reqeust.getReader().readLine();
			Message msg = JSON.constructMessage(msgJson);
			if (msg.getType().equals("new-user")){
				User user = JSON.constructUser(msg.getMessage());
				user.Created();
				User existingUser = ofy().load().type(User.class).id(user.getEmail()).now();
				JSON j = new JSON();
				if (null != existingUser){
					response.getWriter().print(j.toJson(new ErrorMessage("Email Already Exist")));
				}else{
					ofy().save().entity(user).now();
					response.getWriter().print(j.toJson(user));
				}
			} else if (msg.getType().equals("new-med-profile")){
				MedRepProfile profile = JSON.constructMedProfile(msg.getMessage());
				ofy().save().entity(profile).now();
				User user = ofy().load().type(User.class).id(msg.getUserId()).now();
				user.setProfile(profile);
				ofy().save().entity(user).now();
			} else if (msg.getType().equals("new-doc-profile")){
				DoctorProfile profile = JSON.constructDocProfile(msg.getMessage());
				ofy().save().entity(profile).now();
				User user = ofy().load().type(User.class).id(msg.getUserId()).now();
				user.setProfile(profile);
				ofy().save().entity(user).now();
				
			} else if (msg.getType().equals("new-pharma-profile")){
				PharmaProfile profile = JSON.constructPharmaProfile(msg.getMessage());
				ofy().save().entity(profile).now();
				User user = ofy().load().type(User.class).id(msg.getUserId()).now();
				user.setProfile(profile);
				ofy().save().entity(user).now();
			} else if (msg.getType().equals("get-profile")){
				User user = ofy().load().type(User.class).id(msg.getUserId()).now();
				Profile p = user.getProfile();
				JSON j = new JSON();
				response.getWriter().print(j.toJson(p));
			} 
	}
	
	@Override
	public void doGet(HttpServletRequest reqeust, HttpServletResponse response)
			throws IOException {

			String email = reqeust.getParameter("email");
			User u = ofy().load().type(User.class).id(email).now();
			Profile p = u.getProfile();
			JSON j = new JSON();
			response.getWriter().print("["+j.toJson(u)+","+j.toJson(p)+"]");

	}
}
