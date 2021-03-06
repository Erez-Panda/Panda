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

public class ProductManagerServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8310526513768683256L;
	
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String msgJson = req.getReader().readLine();
		Message msg = JSON.constructMessage(msgJson);
		if (msg.getType().equals("new-product")){
			Product product = JSON.constructProduct(msg.getMessage());
			product.Created();
			User creator = ofy().load().type(User.class).id(product.creatorId).now();
			//save resources somehow
			product.setCreator(creator);
			
			ofy().save().entity(product).now();
			creator.addProduct(product);
			ofy().save().entity(creator).now();
			resp.getWriter().print("OK");
		} else if (msg.getType().equals("get-all")){
			List<Product> products = ofy().load().type(Product.class).list();
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(products));
		} else if (msg.getType().equals("delete-all")){
			// You can query for just keys, which will return Key objects much more efficiently than fetching whole objects
			Iterable<Key<Product>> allKeys = ofy().load().type(Product.class).keys();
			// Useful for deleting items
			ofy().delete().keys(allKeys);
			resp.getWriter().print("All products deleted");
		}
		else if (msg.getType().equals("get-products")){
			User user = ofy().load().type(User.class).id(msg.getUserId()).now();
			ArrayList<Ref<Product>> productRefs = user.getProducts();
			List<Product> products = new ArrayList<Product>();
			for(Iterator<Ref<Product>> i = productRefs.iterator(); i.hasNext(); ) {
				Ref<Product> ref = i.next();
				products.add(ref.get());
			}
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(products));
		}

	}

}
