# Build your own Secure Messenger in 3 hours

This repository contains the code and milestones for [Ben Dechrai](https://bendechrai.com)'s workshop of the same name.

## Requirements

The workshop uses VirtualBox 5.1.34 and Vagrant 1.9.1 as a basis for sandboxed development. Participants will be expected to have these versions running and working already.

In addition, the Vagrant machine we'll be using is `bento/debian-9.4`, which participants can pre-fetch with:

        vagrant box add bento/debian-9.4

## Steps

To help keep participants on track, the workshop can be run from beginning to end in one step. Participants who need more time may elect to move on to a known working version of a subsequent step during the workshop, and revisit the details of each step in their own time at a later time.

These steps we'll follow in the workshop are:

0. Welcome and getting started (5 minutes),
1. Take a base Laravel install, and ensure passwords are hashed before sending to the server (10 minutes),
2. Create a contact list view for users,
3. Create a message model, a user controller and view, and allow users to see messages,
4. Add functionality to create new messages for someone,
5. Add [OpenPGP.js](https://github.com/openpgpjs/openpgpjs/) and generate a new keypair,
6. Create an endpoint to allow a user to get a contact's public key,
7. Encrypt the message before sending it to the server,
8. Decrypt encrypted messages,

## URLs and document roots for each step

Each of these steps is a starting milestone in this repo, and available at `https://localhost:xxxx/` where `xxxx` is the step number plus 3000. For example, if starting from step 3, participants can head to `https://localhost:3003/`.

Similarly, each step has it's own known-good document root, in the `docroots/stepx` folder, where `x` is the step number.
