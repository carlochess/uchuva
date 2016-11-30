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
                // sh 'npm run test-selenium'
                // sh 'npm run test-jmeter'
                // sh 'npm run test-integration'
                junit 'test-reports.xml'
                // junit 'test-selenium-reports.xml'
                // junit 'test-jmeter-reports.xml'
                // junit 'test-integration-reports.xml'
            }
		   
       stage 'Build Docker Images' 
            sh '/usr/local/bin/docker-compose up -d'
            sh 'docker save tesis_uchuva > uchuva.tar'
            archiveArtifacts artifacts: 'uchuva.tar', fingerprint: true
       
       stage 'Build NPM package' 
            dir('prototipo'){
                sh 'npm pack'
    	    }
    	    archiveArtifacts artifacts: 'prototipo/uchuva-*.tgz', fingerprint: true
       
       stage 'Build DEB-RPM' 
            dir('prototipo'){
    	        sh './build'
    	    }
            archiveArtifacts artifacts: 'vagrant/deb/*.deb', fingerprint: true

       stage 'Cleanup'
            sh 'rm node_modules -rf'
            sh '/usr/local/bin/docker-compose stop'
            sh '/usr/local/bin/docker-compose rm -f'
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
