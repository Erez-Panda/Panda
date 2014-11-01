package com.panda.video.server;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class SessionTokenServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2008724701447617659L;
	
	private String sessionToken;

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.getWriter().write(sessionToken);
	}
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		sessionToken = req.getParameter("token");
	}

}
