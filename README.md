# Mustang Marks
An enhanced PolyRatings view, complete with Chrome Extension that plugs into PASS
54.153.82.85 or ec2-54-153-82-85.us-west-1.compute.amazonaws.com

---

# How to connect to the server
1. generate a public and private key in the ~/.ssh folder 
    ssh-keygen -t rsa<br>
2. send me the public key, it ends in .pub<br>
3. create a file called "config" in your ~/.ssh folder and enter:<br>
    Host hackathon<br>
    HostName ec2-54-153-82-85.us-west-1.compute.amazonaws.com<br>
    Port 22<br>
    User hackathon-user<br>
    IdentityFile ~/.ssh/id_rsa<br>
4. use ssh!<br>
    ssh hackathon
