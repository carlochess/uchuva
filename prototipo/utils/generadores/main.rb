#!/usr/bin/env ruby

require 'swagger_client'
require 'optparse'

SwaggerClient.configure do |config|
     config.host= "127.0.0.1:3000"
end

dagapi   = SwaggerClient::DagApi.new
runapi   = SwaggerClient::RunApi.new
buildapi = SwaggerClient::BuildApi.new
vfsapi   = SwaggerClient::VFSApi.new
userapi  = SwaggerClient::UserApi.new

apikey = "admin"

archivo = {
  :id => "",
  :entrada => "true"
}

nodeRun = {
  :title => "Homa mun",
  :id => 0,
  :x => 0,
  :y => 0,
  :configurado => {
    :location => "/bin/cat",
    :argumento => "/etc/hosts",
    :files => []
  }
}

edge = {
  :source => {
    :id => 0
  },
  :target => {
    :id => 0
  }
}


=begin
  result = userapi.register_post({
    :username => "testuser",
    :password => "testuser"
  })
  p result
rescue SwaggerClient::ApiError => e
  puts "Exception when calling UserApi->register_post: #{e}"
=end

#def submit
  begin
    result = dagapi.user_get(apikey)
    puts "Numero de dags", result.length
=begin
    result = dagapi.crear_dag_get(apikey)
    p "He creado un dag llamado",result.nombre
    id = result.id
    nombre = result.nombre
    p "El ID del dag es",id
    dag = {
      :proyecto => id,
      :nodes => [nodeRun],
      :edges => [],
      :tipo => 0
    }

    result = dagapi.save_post(apikey, { :body => dag})
    p "He guardado el dag",nombre
    saverr = result.error

    result = runapi.run_post(apikey, { :body => dag})
    p "He ejecutado el  dag", nombre , ", el Dax ese es ", result.id
    result = buildapi.builds_get apikey, id
    nombreExe = result[0].nombre
    p "El nombre de la ejecucion es ", nombreExe
    resultDagExe = buildapi.build_get apikey, nombreExe
    p "El nombre de la ejecucion es ", resultDagExe
    archivos=vfsapi.listar_post(apikey).result
    p "archivos",archivos

    carpeta=vfsapi.crear_carpeta_post(apikey, {:new_path =>  {:path => "real"}})
    p carpeta.id

    result = vfsapi.crear_archivo_post(apikey, File.new(__FILE__))
    archivoCreado = result.success
    p archivoCreado
=end
=begin
    result = vfsapi.descargar_archivo_get(apikey, archivoCreado)
    p result

    result = vfsapi.contenido_archivo_post(apikey, {:item => archivoCreado})
    p result

    result = vfsapi.eliminar_archivo_post(apikey, {:item => archivoCreado})
    p result
=end

    #sleep 120
    #["err","log","out"].each do |type|
    #  p buildapi.data_node_dag_post(apikey, {:idEjecucion => nombreExe, :nodo => result[0].nodes[0], :tipo => type}).info
    #end

    if 0.0 == 0.0 then
      #result = dagapi.user_get(apikey)
      #p result
      #result = dagapi.eliminar_dag_get(apikey, id)
      #p result.error
      #result = dagapi.user_get(apikey)
      #p result
    else
      p "Error al guardar"
    end
  rescue SwaggerClient::ApiError => e
    puts "Exception when calling BuildApi->build_get: #{e}"
  end
#end

#submit
=begin
options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: example.rb [options]"

  opts.on("-s", "--submit", "Submit to uchuva") do |s|
    options[:submit] = s
  end
end.parse!

p options
p ARGV
=end
