package com.panda.video.server;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static com.panda.video.server.OfyService.ofy;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Load;


public class ScheduleServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6500732216402087498L;
	
	private void sendCallRequest (CallRequest call, List<User> users){
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);

        String msgBody = "Hello, we have a call opening for you. <a href=\"http://pandavideochat.appspot.com/pandaFront/welcome.html\">click here</a> to view";

        try {
            Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress("erez.haim@outlook.com", "Panda"));
            msg.addRecipient(Message.RecipientType.TO,
                             new InternetAddress("erez.panda@gmail.com", "Erez"));
            msg.setSubject("You have a call opening");
            msg.setText(msgBody);
            Transport.send(msg);

        } catch (AddressException e) {
            // ...
        } catch (MessagingException e) {
            // ...
        } catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {

		String msgJson = req.getReader().readLine();
		com.panda.video.server.Message msg = JSON.constructMessage(msgJson);
		if (msg != null) {
			if (msg.getType().equals("new-call-request")){
				CallRequest cReq = JSON.constructCallRequest(msg.getMessage());
				User creator = ofy().load().type(User.class).id(msg.getUserId()).now();
				Product product = ofy().load().type(Product.class).id(msg.getId()).now();
				User bestUser = null;
				Call lastCall = ofy().load().type(Call.class).filter("calleeId", msg.getUserId())
						.filter("productId", msg.getId())
						.order("-start")
						.first()
						.now();
				if (null != lastCall){
					bestUser = lastCall.getCaller();
				}
				List<User> users = ofy().load().type(User.class).order("-rating").limit(10).list();
				if (null != bestUser){
					users.add(0, bestUser);
				}
				for(Iterator<User> i = users.iterator(); i.hasNext(); ) {
					User user = i.next();
					cReq.addBestMatch(user.userId);
				}
				cReq.active = true;
				cReq.setProduct(product);
				cReq.setCreator(creator);
				ofy().save().entity(cReq).now();
				sendCallRequest(cReq, users);
			} else if(msg.getType().equals("get-call-request")){
				User user = ofy().load().type(User.class).id(msg.getUserId()).now();
				List<CallRequest> callRequests = ofy().load().type(CallRequest.class).filter("active", true).list();
				List<CallRequest> userRequests = new ArrayList<CallRequest>();
				for(Iterator<CallRequest> i = callRequests.iterator(); i.hasNext(); ) {
					CallRequest cReq = i.next();
					if (cReq.getBestMatchs().contains(user.userId)){
						userRequests.add(cReq);
					}
				}
				JSON j = new JSON();
				resp.getWriter().print(j.toJson(userRequests));
				
			} else if(msg.getType().equals("answer-call-request")){
				CallRequest cReq = ofy().load().type(CallRequest.class).id(msg.getId()).now();
				if (!cReq.active || null != cReq.respodner){
					resp.getWriter().print("Already assigned");
					return;
				}
				User user = ofy().load().type(User.class).id(msg.getUserId()).now();
				cReq.active = false;
				cReq.setRespodner(user);
				ofy().save().entity(cReq).now();
				
				Call call = new Call();
				call.Created();

				//save resources somehow
				call.setCaller(user);
				User callee = cReq.getCreator();
				call.setCallee(callee);
				call.setProduct(cReq.getProduct());
				call.title = "Call about...";
				call.callerId = user.userId;
				call.calleeId = callee.userId;
				call.start = cReq.start;
				call.end = cReq.start + (15*60*1000);
				
				ofy().save().entity(call).now();
				user.addCall(call);
				callee.addCall(call);
				ofy().save().entity(user).now();
				ofy().save().entity(callee).now();
				resp.getWriter().print("OK");
			}
		}
	}	
}
