package com.panda.video.server;

import static com.panda.video.server.OfyService.ofy;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Ref;



public class CallManagerServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2621284621480429595L;
	
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String msgJson = req.getReader().readLine();
		Message msg = JSON.constructMessage(msgJson);
		if (msg.getType().equals("new-call")){
			Call call = JSON.constructCall(msg.getMessage());
			call.Created();
			User caller = ofy().load().type(User.class).id(call.callerId).now();
			User callee = ofy().load().type(User.class).id(call.calleeId).now();
			//Product p = ofy().load().type(Product.class).id(call.productId).now();
			//save resources somehow
			call.setCaller(caller);
			call.setCallee(callee);
			//call.setProduct(p);
			
			ofy().save().entity(call).now();
			caller.addCall(call);
			callee.addCall(call);
			ofy().save().entity(caller).now();
			ofy().save().entity(callee).now();
			resp.getWriter().print("OK");
		} else if (msg.getType().equals("get-all")){
			List<Call> calls = ofy().load().type(Call.class).list();
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(calls));
		} else if (msg.getType().equals("delete-all")){
			// You can query for just keys, which will return Key objects much more efficiently than fetching whole objects
			Iterable<Key<Call>> allKeys = ofy().load().type(Call.class).keys();
			// Useful for deleting items
			ofy().delete().keys(allKeys);
			resp.getWriter().print("All calls deleted");
		}
		else if (msg.getType().equals("get-calls")){
			User caller = ofy().load().type(User.class).id(msg.getUserId()).now();
			ArrayList<Ref<Call>> callRefs = caller.getCalls();
			List<Call> calls = new ArrayList<Call>();
			for(Iterator<Ref<Call>> i = callRefs.iterator(); i.hasNext(); ) {
				Ref<Call> ref = i.next();
				calls.add(ref.get());
			}
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(calls));
		}

	}

}
