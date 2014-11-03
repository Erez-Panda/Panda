package com.panda.video.server;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.VoidWork;

import static com.panda.video.server.OfyService.ofy;

public class UserManagmentServlet extends HttpServlet {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -6690220531052390423L;

	@Override
	public void doPost(HttpServletRequest reqeust, HttpServletResponse response)
			throws IOException {

			String userJson = reqeust.getReader().readLine();
			User user = JSON.constructFromJson(userJson);
			User existingUser = ofy().load().type(User.class).id(user.getEmail()).now();
			if (null != existingUser){
				JSON j = new JSON();
				response.getWriter().print(j.toJson(new ErrorMessage("Email Already Exist")));
			}else{
				//DBWrapper.addUser(user);
				ofy().save().entity(user).now();

			}

	}
	
	@Override
	public void doGet(HttpServletRequest reqeust, HttpServletResponse response)
			throws IOException {

			String email = reqeust.getParameter("email");
			User u = ofy().load().type(User.class).id(email).now();
			JSON j = new JSON();
			response.getWriter().print(j.toJson(u));
	}
}
