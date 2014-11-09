package com.panda.video.server;

import static com.panda.video.server.OfyService.ofy;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;

public class FileUploadServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4355384575182138418L;
	private boolean isMultipart;

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {


		isMultipart = ServletFileUpload.isMultipartContent(req);
		
		// Create a new file upload handler
		ServletFileUpload upload = new ServletFileUpload();
		// Parse the request to get file items.
		try {
			FileItemIterator i = upload.getItemIterator(req);

			while ( i.hasNext () ){
				FileItemStream item = i.next();
				if ( !item.isFormField () ){
				
				    InputStream stream = item.openStream();
					// Save the file 
					byte[] b = IOUtils.toByteArray(stream);
					stream.read(b);

					ResourceData rd = new ResourceData(item.getName(), item.getName(), b.length);
					rd.Created();
					rd.setData(b);
					Long id = ofy().save().entity(rd).now().getId();
					resp.getWriter().print(id);
				}
			}
		} catch (FileUploadException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public void doGet(HttpServletRequest reqeust, HttpServletResponse response)
			throws IOException {

		Long id = Long.parseLong(reqeust.getParameter("id"));
		ResourceData rd = ofy().load().type(ResourceData.class).id(id).now();
		//response.setHeader("Content-Disposition","attachment; filename=" + rd.fileName);
		response.getOutputStream().write(rd.getData(),0,rd.getData().length);

	}

}
