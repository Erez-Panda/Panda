package com.panda.video.server;

import static com.panda.video.server.OfyService.ofy;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class StaticDataServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8272400812434205944L;

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String msgJson = req.getReader().readLine();
		Message msg = JSON.constructMessage(msgJson);
		if (msg.getType().contains("get")){
			List<?> options = new ArrayList<StaticEntity>();
			if (msg.getType().equals("get-degrees")){
				options = ofy().load().type(DegreeOption.class).list();
			} else if (msg.getType().equals("get-doctor-specialties")){
				options = ofy().load().type(DoctorSpecialty.class).list();
			} else if (msg.getType().equals("get-resource-types")){
				options = ofy().load().type(ResourceType.class).list();
			}  else if (msg.getType().equals("get-languages")){
				options = ofy().load().type(LanguageOption.class).list();
			} else if (msg.getType().equals("get-call-hours")){
				options = ofy().load().type(CallHourOption.class).list();
			} else if (msg.getType().equals("get-call-frequencies")){
				options = ofy().load().type(CallFrequencyOption.class).list();
			} else if (msg.getType().equals("get-hcp-segments")){
				options = ofy().load().type(HcpSegmentOption.class).list();
			} else if (msg.getType().equals("get-call-quantities")){
				options = ofy().load().type(CallQuantityOption.class).list();
			}
			JSON j = new JSON();
			resp.getWriter().print(j.toJson(options));
		} else if (msg.getType().contains("add")){
			StaticEntity entity = JSON.constructStaticEntity(msg.getMessage());
			if (msg.getType().equals("add-degrees")){
				entity = new DegreeOption(entity);
				ofy().save().entity(entity).now();
			} else if (msg.getType().equals("add-doctor-specialties")){
				entity = new DoctorSpecialty(entity);
				ofy().save().entity(entity).now();
			} else if (msg.getType().equals("add-resource-types")){
				entity = new ResourceType(entity);
				ofy().save().entity(entity).now();
			}  else if (msg.getType().equals("add-languages")){
				entity = new LanguageOption(entity);
				ofy().save().entity(entity).now();
			} else if (msg.getType().equals("add-call-hours")){
				entity = new CallHourOption(entity);
				ofy().save().entity(entity).now();
			} else if (msg.getType().equals("add-call-frequencies")){
				entity = new CallFrequencyOption(entity);
				ofy().save().entity(entity).now();
			} else if (msg.getType().equals("add-hcp-segments")){
				entity = new HcpSegmentOption(entity);
				ofy().save().entity(entity).now();
			} else if (msg.getType().equals("add-call-quantities")){
				entity = new CallQuantityOption(entity);
				ofy().save().entity(entity).now();
			}
			resp.getWriter().print(entity.id);
		}else if (msg.getType().contains("delete")){
			if (msg.getType().equals("delete-degrees")){
				ofy().delete().type(DegreeOption.class).id(msg.getId()); 
			} else if (msg.getType().equals("delete-doctor-specialties")){
				ofy().delete().type(DoctorSpecialty.class).id(msg.getId()); 
			} else if (msg.getType().equals("delete-resource-types")){
				ofy().delete().type(ResourceType.class).id(msg.getId()); 
			}  else if (msg.getType().equals("delete-languages")){
				ofy().delete().type(LanguageOption.class).id(msg.getId()); 
			} else if (msg.getType().equals("delete-call-hours")){
				ofy().delete().type(CallHourOption.class).id(msg.getId()); 
			} else if (msg.getType().equals("delete-call-frequencies")){
				ofy().delete().type(CallFrequencyOption.class).id(msg.getId()); 
			} else if (msg.getType().equals("delete-hcp-segments")){
				ofy().delete().type(HcpSegmentOption.class).id(msg.getId()); 
			} else if (msg.getType().equals("delete-call-quantities")){
				ofy().delete().type(CallQuantityOption.class).id(msg.getId()); 
			}
			resp.getWriter().print("OK");
		}

	}
}

