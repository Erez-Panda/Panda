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
			User callee = null;
			boolean isGuest = (call.calleeId == 0);
			User caller = ofy().load().type(User.class).id(call.callerId).now();
			if (!isGuest){
				 callee = ofy().load().type(User.class).id(call.calleeId).now();
			}
			Product p = ofy().load().type(Product.class).id(call.productId).now();
			//save resources somehow
			call.setCaller(caller);
			if (!isGuest){
				call.setCallee(callee);
			}
			call.setProduct(p);
			
			ofy().save().entity(call).now();
			caller.addCall(call);
			ofy().save().entity(caller).now();

			if (!isGuest){
				callee.addCall(call);
				ofy().save().entity(callee).now();
			}
			resp.getWriter().print(call.getId());
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
		} else if (msg.getType().equals("get-calls")){
			User caller = ofy().load().type(User.class).id(msg.getUserId()).now();
			ArrayList<Ref<Call>> callRefs = caller.getCalls();
			List<Call> calls = new ArrayList<Call>();
			for(Iterator<Ref<Call>> i = callRefs.iterator(); i.hasNext(); ) {
				Ref<Call> ref = i.next();
				calls.add(ref.get());
			}
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(calls));
		} else if (msg.getType().equals("get-current-call")){
			User user = ofy().load().type(User.class).id(msg.getUserId()).now();
			Long currTime = Long.parseLong(msg.getMessage());
			ArrayList<Ref<Call>> callRefs = user.getCalls();
			Call call = null;
			for(Iterator<Ref<Call>> i = callRefs.iterator(); i.hasNext(); ) {
				Ref<Call> ref = i.next();
				call = ref.get();
				if (null != call && call.start <= (currTime + (15*60*1000)) && currTime < call.end){
					JSON j = new JSON();
					User caller = call.getCaller(); // get the other side
					if (caller.userId == user.userId){
						try{
							caller = call.getCallee();
						}catch(Exception e){
							caller = null;
						}
					}
					Product product = null;
					try{
						product = call.getProduct();
					}catch(Exception e){}
					resp.getWriter().print("["+j.toJson(call)+","+j.toJson(caller)+","+j.toJson(product)+"]");
					return;
				}	
			}
			resp.getWriter().print("");
		} else if (msg.getType().equals("get-guest-call")){
			Call call = ofy().load().type(Call.class).id(msg.getId()).now();
			Long currTime = Long.parseLong(msg.getMessage());
			if (null != call && call.start <= (currTime + (15*60*1000)) && currTime < call.end){
				JSON j = new JSON();
				User caller = call.getCaller(); // get the other side
				Product product = null;
				try{
					product = call.getProduct();
				}catch(Exception e){}
				resp.getWriter().print("["+j.toJson(call)+","+j.toJson(caller)+","+j.toJson(product)+"]");
				return;
			}
			resp.getWriter().print("");
		}

	}

}
