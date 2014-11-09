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

public class TrainingManagerServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8496917643350174599L;
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String msgJson = req.getReader().readLine();
		Message msg = JSON.constructMessage(msgJson);
		if (msg.getType().equals("new-training")){
			Training training = JSON.constructTraining(msg.getMessage());
			training.Created();
			User creator = ofy().load().type(User.class).id(msg.getUserId()).now();
			//save resources somehow
			training.setCreator(creator);
			ofy().save().entity(training).now();
			Product product = ofy().load().type(Product.class).id(training.productId).now();
			product.addTraining(training);
			ofy().save().entity(product).now();
			resp.getWriter().print("OK");
		} else if (msg.getType().equals("get-all")){
			List<Training> trainings = ofy().load().type(Training.class).list();
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(trainings));
		} else if (msg.getType().equals("delete-all")){
			// You can query for just keys, which will return Key objects much more efficiently than fetching whole objects
			Iterable<Key<Training>> allKeys = ofy().load().type(Training.class).keys();
			// Useful for deleting items
			ofy().delete().keys(allKeys);
			resp.getWriter().print("All products deleted");
		}
		else if (msg.getType().equals("get-trainings")){
			Product product = ofy().load().type(Product.class).id(msg.getUserId()).now();
			ArrayList<Ref<Training>> trainingRefs = product.getTrainings();
			List<Training> trainings = new ArrayList<Training>();
			for(Iterator<Ref<Training>> i = trainingRefs.iterator(); i.hasNext(); ) {
				Ref<Training> ref = i.next();
				trainings.add(ref.get());
			}
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(trainings));

		}  else if (msg.getType().equals("assign-training")){
			User user = ofy().load().type(User.class).id(msg.getUserId()).now();
			Training training = ofy().load().type(Training.class).id(msg.getTrainingId()).now();
			user.addTraining(training);
			ofy().save().entity(user).now();
			resp.getWriter().print("OK");
		}  else if (msg.getType().equals("get-user-trainings")){
			User user = ofy().load().type(User.class).id(msg.getUserId()).now();
			ArrayList<Ref<Training>> trainingRefs = user.getTrainings();
			List<Training> trainings = new ArrayList<Training>();
			for(Iterator<Ref<Training>> i = trainingRefs.iterator(); i.hasNext(); ) {
				Ref<Training> ref = i.next();
				trainings.add(ref.get());
			}
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(trainings));
		}

	}

}
