<script lang="ts">
  type InputProps = {
    type: string;
    name: string;
    class?: string;
  };

  let { type, name, class: className }: InputProps = $props();
</script>
<input {type} {name} 
class={ className || "w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"} />