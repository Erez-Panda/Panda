package com.panda.video.server;

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
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		
		String userJson = req.getReader().readLine();
		User user = JSON.constructFromJson(userJson);
		User existingUser = DBWrapper.getUser(user.getEmail());
		if (null != existingUser){
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(new ErrorMessage("Email Already Exist")));
		}else{
			DBWrapper.addUser(user);
		}
		

	}
	
	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		
		String email = req.getParameter("email");
		User u = DBWrapper.getUser(email);
		JSON j = new JSON();
		resp.getWriter().print(j.toJson(u));
	}

}
