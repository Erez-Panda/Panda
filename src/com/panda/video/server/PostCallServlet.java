package com.panda.video.server;

import static com.panda.video.server.OfyService.ofy;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.googlecode.objectify.Ref;

public class PostCallServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5229161486779384962L;

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {

		String msgJson = req.getReader().readLine();
		Message msg = JSON.constructMessage(msgJson);
		if (msg != null) {
			if (msg.getType().equals("doc-rate-call")){
				PostCall pCall = ofy().load().type(PostCall.class).filter("callId", msg.getId()).first().now();
				PostCall newData = JSON.constructPostCall(msg.getMessage());
				if (null == pCall){
					pCall = new PostCall();
					pCall.Created();
					pCall.callId = msg.getId();
				} 
				pCall.doctorRating =  newData.rating;
				ofy().save().entity(pCall).now();
			} else if(msg.getType().equals("rep-rate-call")){
				PostCall pCall = ofy().load().type(PostCall.class).filter("callId", msg.getId()).first().now();
				PostCall newData = JSON.constructPostCall(msg.getMessage());
				if (null == pCall){
					pCall = new PostCall();
					pCall.Created();
					pCall.callId = msg.getId();
				} 
				pCall.rating =  newData.rating;
				pCall.details = newData.details;
				pCall.callLength = newData.callLength;
				pCall.start = newData.start;
				pCall.sessionNumber = newData.sessionNumber;
				ofy().save().entity(pCall).now();
			} else if(msg.getType().equals("get-call-data")){
				PostCall pCall = ofy().load().type(PostCall.class).filter("callId", msg.getId()).first().now();
				JSON j = new JSON();
				resp.getWriter().print(j.toJson(pCall));
			} else if(msg.getType().equals("get-last-call-data")){
				User uesr = ofy().load().type(User.class).id(msg.getUserId()).now();
				Call currCall = ofy().load().type(Call.class).id(msg.getId()).now();
				ArrayList<Ref<Call>> callRefs = uesr.getCalls();
				Call call = null;
				Call lastCall = null;
				for(Iterator<Ref<Call>> i = callRefs.iterator(); i.hasNext(); ) {
					Ref<Call> ref = i.next();
					call = ref.get();
					if (null != call && (null == lastCall || call.start > lastCall.start)){
						if (call.getId() - msg.getId() != 0){ // not current call
							boolean sameProduct = true;
							try{
								sameProduct = call.getProduct().getId() == currCall.getProduct().getId();
							}catch(Exception e){}
							if (sameProduct){
								lastCall = call;
							}
						}
					}	
				}
				PostCall pCall = null;
				try{
					pCall = ofy().load().type(PostCall.class).filter("callId", lastCall.getId()).first().now();
				}catch(Exception e){}
				JSON j = new JSON();
				resp.getWriter().print(j.toJson(pCall));
			}
		}
	}

}
