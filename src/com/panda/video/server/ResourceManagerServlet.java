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

public class ResourceManagerServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2046693910534419299L;
	
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String msgJson = req.getReader().readLine();
		Message msg = JSON.constructMessage(msgJson);
		if (msg.getType().equals("new-resource")){
			Resource resource = JSON.constructResource(msg.getMessage());
			resource.Created();
			User uploader = ofy().load().type(User.class).id(msg.getUserId()).now();
			//save resources somehow
			resource.setUploader(uploader);
			ofy().save().entity(resource).now();
			if (null != resource.trainingId){
				Training training = ofy().load().type(Training.class).id(resource.trainingId).now();
				training.addResource(resource);
				ofy().save().entity(training).now();
			} else if (null != resource.productId){
				Product product = ofy().load().type(Product.class).id(resource.productId).now();
				product.addResource(resource);
				ofy().save().entity(product).now();
			}
			resp.getWriter().print(resource.resourceId);
		} else if (msg.getType().equals("get-all")){
			List<Resource> resources = ofy().load().type(Resource.class).list();
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(resources));
		} else if (msg.getType().equals("delete-all")){
			// You can query for just keys, which will return Key objects much more efficiently than fetching whole objects
			Iterable<Key<Resource>> allKeys = ofy().load().type(Resource.class).keys();
			// Useful for deleting items
			ofy().delete().keys(allKeys);
			resp.getWriter().print("All products deleted");
		} else if (msg.getType().equals("get-resources")){
			Product product = ofy().load().type(Product.class).id(msg.getUserId()).now();
			ArrayList<Ref<Resource>> resourceRefs = product.getResources();
			List<Resource> resources = new ArrayList<Resource>();
			for(Iterator<Ref<Resource>> i = resourceRefs.iterator(); i.hasNext(); ) {
				Ref<Resource> ref = i.next();
				resources.add(ref.get());
			}
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(resources));
		} else if (msg.getType().equals("get-training-resources")){
			Training training = ofy().load().type(Training.class).id(msg.getUserId()).now();
			ArrayList<Ref<Resource>> resourceRefs = training.getResources();
			List<Resource> resources = new ArrayList<Resource>();
			for(Iterator<Ref<Resource>> i = resourceRefs.iterator(); i.hasNext(); ) {
				Ref<Resource> ref = i.next();
				resources.add(ref.get());
			}
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(resources));
		} else if (msg.getType().equals("delete-resource")){
			ofy().delete().type(Resource.class).id(msg.getId()); 
		}

	}

}
