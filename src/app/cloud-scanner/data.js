[
    {
      "Region": "us-east-1",
      "VPCs": [
        {
          "VPC_ID": "vpc-123abc",
          "CIDR": "10.0.0.0/16",
          "Internet_Gateway": {
            "IGW_ID": "igw-456def",
            "Attached_VPC": "vpc-123abc",
            "Routes": [
              {
                "Destination": "0.0.0.0/0",
                "Target": "igw-456def",
                "Description": "Route to the Internet"
              }
            ]
          },
          "Subnets": [
            {
              "Subnet_ID": "subnet-aaa111",
              "CIDR": "10.0.1.0/24",
              "Availability_Zone": "us-east-1a",
              "NACL": {
                "NACL_ID": "acl-xyz123",
                "Inbound_Rules": [
                  {
                    "Rule": 100,
                    "Protocol": "TCP",
                    "Port": 80,
                    "Source": "0.0.0.0/0",
                    "Action": "ALLOW"
                  },
                  {
                    "Rule": 200,
                    "Protocol": "TCP",
                    "Port": 22,
                    "Source": "203.0.113.0/24",
                    "Action": "ALLOW"
                  }
                ],
                "Outbound_Rules": [
                  {
                    "Rule": 100,
                    "Protocol": "ALL",
                    "Port": "ALL",
                    "Destination": "0.0.0.0/0",
                    "Action": "ALLOW"
                  }
                ]
              },
              "Security_Groups": [
                {
                  "SG_ID": "sg-abc123",
                  "Description": "Allow HTTP & SSH",
                  "Inbound_Rules": [
                    {
                      "Protocol": "TCP",
                      "Port": 80,
                      "Source": "0.0.0.0/0"
                    },
                    {
                      "Protocol": "TCP",
                      "Port": 22,
                      "Source": "203.0.113.0/24"
                    }
                  ],
                  "Outbound_Rules": [
                    {
                      "Protocol": "ALL",
                      "Port": "ALL",
                      "Destination": "0.0.0.0/0"
                    }
                  ],
                  "EC2_Instances": [
                    {
                      "Instance_ID": "i-1234567890abcdef",
                      "Instance_Type": "t2.micro",
                      "Private_IP": "10.0.1.100",
                      "Security_Groups": [
                        "sg-abc123"
                      ],
                      "IAM_Role": "EC2ReadOnlyRole"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]