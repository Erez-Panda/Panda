package com.panda.video.server;

import static com.panda.video.server.OfyService.ofy;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.googlecode.objectify.Ref;

public class TestsServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1897647052454424345L;
	
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String msgJson = req.getReader().readLine();
		Message msg = JSON.constructMessage(msgJson);
		if (msg.getType().equals("new-test")){
			Resource res = ofy().load().type(Resource.class).id(msg.getId()).now();
			Test test = new Test();
			test.Created();
			ofy().save().entity(test).now();
			res.testId = test.testId;
			ofy().save().entity(res).now();
			resp.getWriter().print(test.testId);
		} else if (msg.getType().equals("add-question")){
			Test test = ofy().load().type(Test.class).id(msg.getId()).now();
			Question q = JSON.constructQuestion(msg.getMessage());
			q.Created();
			ofy().save().entity(q).now();
			
			test.addQuestion(q);
			ofy().save().entity(test).now();
			resp.getWriter().print(q.qId);
		} else if (msg.getType().equals("get-test")){
			Test test = ofy().load().type(Test.class).id(msg.getId()).now();
			ArrayList<Ref<Question>> qRefs = test.getQuestions();
			List<Question> questions = new ArrayList<Question>();
			for(Iterator<Ref<Question>> i = qRefs.iterator(); i.hasNext(); ) {
				Ref<Question> ref = i.next();
				questions.add(ref.get());
			}
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(questions));
		} 

	}


}
