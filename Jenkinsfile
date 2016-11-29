#!groovy
node {
    currentBuild.result = "SUCCESS"
    try {
       stage 'Test'
            env.NODE_ENV = "test"
            checkout scm
            print "Environment will be : ${env.NODE_ENV}"
            dir('prototipo'){
		sh 'node -v'
		sh 'npm prune'
		sh 'npm install'
		sh 'npm test'
                //sh 'npm run test-selenium'
                junit 'test-reports.xml'
            }
		   
       stage 'Build Docker' 
            sh '/usr/local/bin/docker-compose up -d'
            sh 'docker save tesis_uchuva > uchuva.tar'
            archiveArtifacts artifacts: 'uchuva.tar', fingerprint: true
       
       stage 'Build Npm' 
	    dir('prototipo'){
    	        sh 'npm pack'
    	    }
    	    archiveArtifacts artifacts: 'prototipo/uchuva-*.tgz', fingerprint: true
       
       stage 'Deploy' 
            echo 'Push to Repo'
            dir('prototipo'){
	        sh './build'
	     // sh 'npm run rpm'
	    }
	    archiveArtifacts artifacts: 'vagrant/deb/*.deb', fingerprint: true
		   
       stage 'Cleanup' 
            echo 'prune and cleanup'
            sh 'rm node_modules -rf'
            sh '/usr/local/bin/docker-compose stop'
            sh '/usr/local/bin/docker-compose rm -f'
            echo 'dangling docker images'
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
def version() {
  def matcher = readFile('pom.xml') =~ '<version>(.+)</version>'
  matcher ? matcher[0][1] : null
}
