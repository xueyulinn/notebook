# EC2

## Elastic IP

When an EC2 instance stops and restarts its public IP can change. We can create an elastic IP which is a public IP and attch it to the instance, it will not change.

## Placement Groups

### Cluster

- Place all instances on the same AZ.
- Lowest latency.

### Spread

- Each instance is placed on a unique rack.
- High Availability.

### Partition

- Each partition corresponds to a physical.
- Place all instances on multiple partitions.
- Can cross AZs.
- Anti-correlation.

## ENI

- Virtual internet card.
- Bound to an AZ.

## EC2 Hibernate

- Just like the hibernate of PC.
- When EC2 stops the RAM is dumped to EBS instead of lost.
- Then restarts it loads.
