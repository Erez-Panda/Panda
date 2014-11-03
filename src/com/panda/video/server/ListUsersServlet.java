package com.panda.video.server;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ListUsersServlet extends HttpServlet {


	/**
	 * 
	 */
	private static final long serialVersionUID = 5419867878904708021L;

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {

	}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String delete = req.getParameter("delete");
		if (null!= delete && delete.equals("true")){
			DBWrapper.cleanUserDB();
			resp.getWriter().print("All users deleted");
		}else {
			ArrayList<User> users = DBWrapper.listUserDB();
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(users));
		}

	}

}