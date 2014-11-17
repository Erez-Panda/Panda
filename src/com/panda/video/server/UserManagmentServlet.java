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
				User existingUser = ofy().load().type(User.class).filter("email", user.getEmail()).first().now();
				JSON j = new JSON();
				if (null != existingUser){
					response.getWriter().print(j.toJson(new ErrorMessage("Email Already Exist")));
				}else{
					user.rating = 3;
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
				Profile p = null;
				try{
					p = user.getProfile();
				}catch(Exception e){}
				JSON j = new JSON();
				response.getWriter().print(j.toJson(p));
			}  else if (msg.getType().equals("update-user")){
				User user = JSON.constructUser(msg.getMessage());
				User oldUser =  ofy().load().type(User.class).id(msg.getUserId()).now();
				oldUser.update(user);
				ofy().save().entity(oldUser).now();
			} else if (msg.getType().equals("update-doc-profile")){
				DoctorProfile profile = JSON.constructDocProfile(msg.getMessage());
				DoctorProfile oldProfile =  ofy().load().type(DoctorProfile.class).id(msg.getUserId()).now();
				oldProfile.update(profile);
				ofy().save().entity(oldProfile).now();
			} else if (msg.getType().equals("delete-user")){
				ofy().delete().type(User.class).id(msg.getId()); 
			} else if (msg.getType().equals("approve-user")){
				User user =  ofy().load().type(User.class).id(msg.getUserId()).now();
				user.status = "approved";
				ofy().save().entity(user).now();
			}
	}
	
	@Override
	public void doGet(HttpServletRequest reqeust, HttpServletResponse response)
			throws IOException {
/*
			String email = reqeust.getParameter("email");
			JSON j = new JSON();
			User u = ofy().load().type(User.class).filter("email", email).list().first().now();
			try{
				Profile p = u.getProfile();
				response.getWriter().print("["+j.toJson(u)+","+j.toJson(p)+"]");
			}catch (Exception e){
				response.getWriter().print("["+j.toJson(u)+"]");
			}
			*/

	}
}
