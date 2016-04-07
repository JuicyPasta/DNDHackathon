# DNDHackathon
54.153.82.85 or ec2-54-153-82-85.us-west-1.compute.amazonaws.com

---

# How to connect to the server
1. generate a public and private key in the ~/.ssh folder 
    ssh-keygen -t rsa
2. send me the public key, it ends in .pub
3. create a file called "config" in your ~/.ssh folder and enter:
    Host hackathon 
    HostName ec2-54-153-82-85.us-west-1.compute.amazonaws.com
    Port 22
    User hackathon-user
    IdentityFile ~/.ssh/id_rsa
4. use ssh!
    ssh hackathon
