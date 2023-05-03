import { CircuitStorage, InMemoryDataSource } from '@0xpolygonid/js-sdk';

const load = (path) => {
  return fetch(`http://localhost:8000${path}`);
};
export class CircuitStorageInstance {
	static instanceCS;
	static async init(){
		const auth_w = await load('/AuthV2/circuit.wasm')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const mtp_w = await load('/credentialAtomicQueryMTPV2/circuit.wasm')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const sig_w = await load('/credentialAtomicQuerySigV2/circuit.wasm')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))

		const auth_z = await load('/AuthV2/circuit_final.zkey')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const mtp_z = await load('/credentialAtomicQueryMTPV2/circuit_final.zkey')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const sig_z = await load('/credentialAtomicQuerySigV2/circuit_final.zkey')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))

		const auth_j = await load('/AuthV2/verification_key.json')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const mtp_j = await load('/credentialAtomicQueryMTPV2/verification_key.json')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const sig_j = await load('/credentialAtomicQuerySigV2/verification_key.json')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))

		if(!this.instanceCS) {
			this.instanceCS = new CircuitStorage(new InMemoryDataSource());
			await this.instanceCS.saveCircuitData('authV2', {
				circuitId: 'authV2'.toString(),
				wasm: auth_w,
				provingKey: auth_z,
				verificationKey: auth_j
			});
			await this.instanceCS.saveCircuitData('credentialAtomicQueryMTPV2', {
				circuitId: 'credentialAtomicQueryMTPV2'.toString(),
				wasm: mtp_w,
				provingKey: mtp_z,
				verificationKey: mtp_j
			});
			await this.instanceCS.saveCircuitData('credentialAtomicQuerySigV2', {
				circuitId: 'credentialAtomicQuerySigV2'.toString(),
				wasm: sig_w,
				provingKey: sig_z,
				verificationKey: sig_j
			});
		}
    console.log(this.instanceCS);
  }
	static getCircuitStorageInstance(){
		return this.instanceCS;
	}
}
