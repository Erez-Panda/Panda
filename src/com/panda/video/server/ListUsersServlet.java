package com.panda.video.server;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.googlecode.objectify.Key;

import static com.panda.video.server.OfyService.ofy;

public class ListUsersServlet extends HttpServlet {


	/**
	 * 
	 */
	private static final long serialVersionUID = 5419867878904708021L;

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		try{
		String msgJson = req.getReader().readLine();
		Message msg = JSON.constructMessage(msgJson);
		if (msg.getType().equals("get-all")){
			List<User> users = ofy().load().type(User.class).list();
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(users));
		} else if (msg.getType().equals("delete-all")){
			// You can query for just keys, which will return Key objects much more efficiently than fetching whole objects
			Iterable<Key<User>> allKeys = ofy().load().type(User.class).keys();

			// Useful for deleting items
			ofy().delete().keys(allKeys);
			resp.getWriter().print("All users deleted");
		}
		}catch(Exception e){
			resp.getWriter().print(e.toString());
		}

	}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		/*
		String delete = req.getParameter("delete");
		if (null!= delete && delete.equals("true")){
			// You can query for just keys, which will return Key objects much more efficiently than fetching whole objects
			Iterable<Key<User>> allKeys = ofy().load().type(User.class).keys();

			// Useful for deleting items
			ofy().delete().keys(allKeys);
			
			resp.getWriter().print("All users deleted");
		}else {
			List<User> users = ofy().load().type(User.class).list();
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(users));
		}
		*/

	}

}