package com.panda.video.server;

import static com.panda.video.server.OfyService.ofy;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.googlecode.objectify.cmd.Query;

public class LoginServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6805648285522856552L;

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String msgJson ="";
		try{
		HttpSession session = req.getSession();
		msgJson = req.getReader().readLine();
		Message msg = JSON.constructMessage(msgJson);
		JSON j = new JSON();
		String sessionUser = (String)session.getAttribute("user");
		if (msg != null) {
			if (msg.getType().equals("login")){
				User login = JSON.constructUser(msg.getMessage());
				User user = ofy().load().type(User.class).filter("email", login.getEmail()).first().now();
				if (null != user){
					if (user.getPassword().equals(login.getPassword())){
						session.setAttribute("user", j.toJson(user));
						//setting session to expiry in 30 mins
						session.setMaxInactiveInterval(30*60);
						resp.getWriter().print(j.toJson(user));
					} else {
						resp.getWriter().print("no user");
					}
				}
			} else if(msg.getType().equals("logout")){
				session.setAttribute("user", null);
				session.invalidate();
			}
		} else if (sessionUser != null){
			resp.getWriter().print(sessionUser);
		} else {
		}
		}catch(Exception e){
			resp.getWriter().print("Somthing is wrong3: ");
			resp.getWriter().print(msgJson);
			resp.getWriter().print(e);
		}
	}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {


	}

}
